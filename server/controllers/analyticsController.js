const Intervention = require("../models/Intervention");

const getInterventionEffectiveness = async (req, res) => {
  try {
    const completed = await Intervention.find({
      status: "COMPLETED"
    });

    const stats = {};

    completed.forEach((intervention) => {
      if (!stats[intervention.type]) {
        stats[intervention.type] = {
          type: intervention.type,
          total: 0,
          improved: 0,
          noChange: 0,
          worsened: 0
        };
      }

      stats[intervention.type].total++;

      if (intervention.outcome === "IMPROVED") {
        stats[intervention.type].improved++;
      }

      if (intervention.outcome === "NO_CHANGE") {
        stats[intervention.type].noChange++;
      }

      if (intervention.outcome === "WORSENED") {
        stats[intervention.type].worsened++;
      }
    });

    const results = Object.values(stats).map((item) => ({
      ...item,
      effectiveness:
        item.total === 0
          ? 0
          : Math.round((item.improved / item.total) * 100)
    }));

    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate intervention effectiveness",
      error: error.message
    });
  }
};

module.exports = {
  getInterventionEffectiveness
};