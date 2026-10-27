const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    interventionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Intervention",
      required: true
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    assignedTo: {
      type: String,
      required: true
    },

    deadline: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["PENDING", "COMPLETED", "OVERDUE"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);