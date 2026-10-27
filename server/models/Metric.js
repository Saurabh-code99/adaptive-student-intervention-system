const mongoose = require("mongoose");

const metricSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    week: {
      type: Number,
      required: true
    },

    attendance: {
      type: Number,
      required: true
    },

    marks: {
      type: Number,
      required: true
    },

    assignmentsCompleted: {
      type: Number,
      required: true
    },

    totalAssignments: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Metric", metricSchema);