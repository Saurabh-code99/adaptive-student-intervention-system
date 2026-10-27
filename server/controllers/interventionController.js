const Student = require("../models/Student");
const Metric = require("../models/Metric");
const Intervention = require("../models/Intervention");
const Task = require("../models/Task");

const { calculateRisk } = require("../services/riskService");
const { generateIntervention } = require("../services/llmService");


// Generate AI intervention
const generateStudentIntervention = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Prevent multiple pending interventions
    const pendingIntervention = await Intervention.findOne({
      studentId: student._id,
      status: "PENDING"
    });

    if (pendingIntervention) {
      return res.status(400).json({
        message:
          "Student already has a pending intervention. Approve or reject it first.",
        intervention: pendingIntervention
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

    const previousInterventions = await Intervention.find({
      studentId: student._id
    }).sort({
      createdAt: 1
    });

    const recommendation = await generateIntervention({
      student,
      risk,
      previousInterventions
    });

    const intervention = await Intervention.create({
      studentId: student._id,
      type: recommendation.type,
      reason: recommendation.reason,
      owner: recommendation.owner,
      deadlineDays: recommendation.deadlineDays,
      status: "PENDING"
    });

    res.status(201).json({
      message: "Intervention generated successfully",
      risk,
      intervention
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to generate intervention",
      error: error.message
    });
  }
};


// Approve intervention
const approveIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findById(
      req.params.id
    );

    if (!intervention) {
      return res.status(404).json({
        message: "Intervention not found"
      });
    }

    if (intervention.status !== "PENDING") {
      return res.status(400).json({
        message: `Intervention is already ${intervention.status}`
      });
    }

    intervention.status = "APPROVED";

    await intervention.save();

    const deadline = new Date();

    deadline.setDate(
      deadline.getDate() + intervention.deadlineDays
    );

    const task = await Task.create({
      interventionId: intervention._id,
      studentId: intervention.studentId,
      title: intervention.type,
      assignedTo: intervention.owner,
      deadline,
      status: "PENDING"
    });

    res.status(200).json({
      message: "Intervention approved and task created",
      intervention,
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to approve intervention",
      error: error.message
    });
  }
};


// Reject intervention
const rejectIntervention = async (req, res) => {
  try {
    const intervention = await Intervention.findById(
      req.params.id
    );

    if (!intervention) {
      return res.status(404).json({
        message: "Intervention not found"
      });
    }

    if (intervention.status !== "PENDING") {
      return res.status(400).json({
        message: `Intervention is already ${intervention.status}`
      });
    }

    intervention.status = "REJECTED";

    await intervention.save();

    res.status(200).json({
      message: "Intervention rejected",
      intervention
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to reject intervention",
      error: error.message
    });
  }
};


// Get all interventions of one student
const getStudentInterventions = async (req, res) => {
  try {
    const interventions = await Intervention.find({
      studentId: req.params.id
    }).sort({
      createdAt: -1
    });

    res.status(200).json(interventions);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch interventions",
      error: error.message
    });
  }
};


module.exports = {
  generateStudentIntervention,
  approveIntervention,
  rejectIntervention,
  getStudentInterventions
};