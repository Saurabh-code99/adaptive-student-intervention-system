const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    rollNumber: {
      type: String,
      required: true,
      unique: true
    },

    className: {
      type: String,
      required: true
    },

    currentRiskScore: {
      type: Number,
      default: 0
    },

    currentRiskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Student", studentSchema);