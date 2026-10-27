const express = require("express");

const {
  generateStudentIntervention,
  approveIntervention,
  rejectIntervention,
  getStudentInterventions
} = require("../controllers/interventionController");

const router = express.Router();

// Generate intervention for a student
router.post(
  "/students/:id/generate",
  generateStudentIntervention
);

// Get all interventions of one student
router.get(
  "/students/:id",
  getStudentInterventions
);

// Approve intervention
router.patch(
  "/:id/approve",
  approveIntervention
);

// Reject intervention
router.patch(
  "/:id/reject",
  rejectIntervention
);

module.exports = router;