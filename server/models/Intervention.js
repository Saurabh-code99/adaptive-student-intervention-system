const mongoose = require("mongoose");

const interventionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    type: {
      type: String,
      enum: [
        "Mentor Meeting",
        "Peer Tutoring",
        "Remedial Class",
        "Parent Contact",
        "Counsellor Referral"
      ],
      required: true
    },

    reason: {
      type: String,
      required: true
    },

    owner: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING"
    },

    outcome: {
      type: String,
      enum: ["IMPROVED", "NO_CHANGE", "WORSENED"],
      default: undefined
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Intervention", interventionSchema);