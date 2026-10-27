const Task = require("../models/Task");

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("studentId", "name rollNumber className")
      .populate("interventionId", "type reason owner status")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
      error: error.message
    });
  }
};


// Mark task as completed
const completeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    task.status = "COMPLETED";

    await task.save();

    res.status(200).json({
      message: "Task completed successfully",
      task
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to complete task",
      error: error.message
    });
  }
};


module.exports = {
  getTasks,
  completeTask
};