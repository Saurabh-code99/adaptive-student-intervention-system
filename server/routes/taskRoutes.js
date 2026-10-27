const express = require("express");

const {
  getTasks,
  completeTask
} = require("../controllers/taskController");

const router = express.Router();

// Get all tasks
router.get("/", getTasks);

// Mark task as completed
router.patch(
  "/:id/complete",
  completeTask
);

module.exports = router;