const Student = require("../models/Student");
const Metric = require("../models/Metric");
const Intervention = require("../models/Intervention");

const { calculateRisk } = require("../services/riskService");


// Keep values inside sensible range
const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};


// Advance the whole system by one simulated week
const advanceWeek = async (req, res) => {
  try {
    const students = await Student.find();

    const results = [];

    for (const student of students) {

      // Get complete metric history
      const metrics = await Metric.find({
        studentId: student._id
      }).sort({
        week: 1
      });

      if (metrics.length === 0) {
        continue;
      }

      const latestMetric = metrics[metrics.length - 1];

      // Find latest approved intervention
      const intervention = await Intervention.findOne({
        studentId: student._id,
        status: "APPROVED"
      }).sort({
        createdAt: -1
      });

      let attendanceChange = 0;
      let marksChange = 0;
      let assignmentChange = 0;

      /*
        For demo reliability:

        First approved intervention may not work.
        Later intervention can improve performance.

        This lets us demonstrate:
        intervention -> outcome -> adaptation.
      */

      if (intervention) {

        const previousCompleted =
          await Intervention.countDocuments({
            studentId: student._id,
            status: "COMPLETED"
          });

        // First intervention fails / has little effect
        if (previousCompleted === 0) {

          attendanceChange = -2;
          marksChange = -1;
          assignmentChange = 0;

        } else {

          // Later intervention improves student
          attendanceChange = 8;
          marksChange = 7;
          assignmentChange = 1;
        }

      } else {

        // No intervention: small natural change
        attendanceChange = 1;
        marksChange = 1;
        assignmentChange = 0;
      }

      const newAttendance = clamp(
        latestMetric.attendance + attendanceChange,
        0,
        100
      );

      const newMarks = clamp(
        latestMetric.marks + marksChange,
        0,
        100
      );

      const newAssignmentsCompleted = clamp(
        latestMetric.assignmentsCompleted + assignmentChange,
        0,
        latestMetric.totalAssignments
      );

      // Add new weekly metric
      await Metric.create({
        studentId: student._id,
        week: latestMetric.week + 1,
        attendance: newAttendance,
        marks: newMarks,
        assignmentsCompleted: newAssignmentsCompleted,
        totalAssignments: latestMetric.totalAssignments
      });

      // Evaluate intervention outcome
      if (intervention) {

        const improved =
          newAttendance > latestMetric.attendance ||
          newMarks > latestMetric.marks;

        const worsened =
          newAttendance < latestMetric.attendance ||
          newMarks < latestMetric.marks;

        if (improved) {
          intervention.outcome = "IMPROVED";
        } else if (worsened) {
          intervention.outcome = "WORSENED";
        } else {
          intervention.outcome = "NO_CHANGE";
        }

        intervention.status = "COMPLETED";

        await intervention.save();
      }

      // Recalculate risk using updated history
      const updatedMetrics = await Metric.find({
        studentId: student._id
      }).sort({
        week: 1
      });

      const risk = calculateRisk(updatedMetrics);

      student.currentRiskScore = risk.score;
      student.currentRiskLevel = risk.level;

      await student.save();

      results.push({
        studentId: student._id,
        name: student.name,
        week: latestMetric.week + 1,
        attendance: newAttendance,
        marks: newMarks,
        assignmentsCompleted: newAssignmentsCompleted,
        interventionOutcome: intervention
          ? intervention.outcome
          : null,
        risk
      });
    }

    res.status(200).json({
      message: "One week advanced successfully",
      results
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to advance week",
      error: error.message
    });
  }
};


module.exports = {
  advanceWeek
};