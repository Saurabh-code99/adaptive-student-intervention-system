const Task = require("../models/Task");

// GET ALL TASKS
const getTasks = async (req, res) => {
  try {
    const now = new Date();

    // Automatically mark expired pending tasks as overdue
    await Task.updateMany(
      {
        status: "PENDING",
        deadline: { $lt: now }
      },
      {
        $set: {
          status: "OVERDUE"
        }
      }
    );

    const tasks = await Task.find()
      .populate(
        "studentId",
        "name rollNumber className currentRiskLevel"
      )
      .populate(
        "interventionId",
        "type reason owner status"
      )
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.error("Failed to fetch tasks:", error);

    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};


// MARK TASK AS COMPLETED
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (task.status === "COMPLETED") {
      return res.status(400).json({
        message: "Task is already completed"
      });
    }

    task.status = "COMPLETED";

    await task.save();

    res.json({
      message: "Task marked as completed",
      task
    });

  } catch (error) {
    console.error(
      "Failed to complete task:",
      error
    );

    res.status(500).json({
      message: "Failed to complete task"
    });
  }
};

module.exports = {
  getTasks,
  completeTask
};