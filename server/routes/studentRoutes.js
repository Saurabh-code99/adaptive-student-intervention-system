const express = require("express");

const {
  getStudents,
  getStudentById,
  getStudentRisk
} = require("../controllers/studentController");

const router = express.Router();

// Get all students
router.get("/", getStudents);

// Get risk of one student
router.get("/:id/risk", getStudentRisk);

// Get one student with metrics
router.get("/:id", getStudentById);

module.exports = router;