const express = require("express");

const {
  getInterventionEffectiveness
} = require("../controllers/analyticsController");

const router = express.Router();

router.get(
  "/intervention-effectiveness",
  getInterventionEffectiveness
);

module.exports = router;