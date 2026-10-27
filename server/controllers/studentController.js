const Student = require("../models/Student");
const Metric = require("../models/Metric");
const { calculateRisk } = require("../services/riskService");

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({
      currentRiskScore: -1
    });

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch students",
      error: error.message
    });
  }
};

// Get one student with weekly metrics
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const metrics = await Metric.find({
      studentId: student._id
    }).sort({
      week: 1
    });

    res.status(200).json({
      student,
      metrics
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch student",
      error: error.message
    });
  }
};

// Calculate risk using complete weekly history
const getStudentRisk = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    const metrics = await Metric.find({
      studentId: student._id
    }).sort({
      week: 1
    });

    if (metrics.length === 0) {
      return res.status(404).json({
        message: "No metrics found for this student"
      });
    }

    const risk = calculateRisk(metrics);

    student.currentRiskScore = risk.score;
    student.currentRiskLevel = risk.level;

    await student.save();

    res.status(200).json({
      studentId: student._id,
      name: student.name,
      score: risk.score,
      level: risk.level,
      reasons: risk.reasons
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate risk",
      error: error.message
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  getStudentRisk
};