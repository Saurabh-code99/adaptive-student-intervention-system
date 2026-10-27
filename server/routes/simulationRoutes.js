const express = require("express");

const {
  advanceWeek
} = require("../controllers/simulationController");

const router = express.Router();

router.post("/advance-week", advanceWeek);

module.exports = router;