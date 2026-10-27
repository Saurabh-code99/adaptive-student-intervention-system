const mongoose = require("mongoose");
const dotenv = require("dotenv");

const dns = require("dns");

dns.setServers(["8.8.8.8"]);

const Student = require("../models/Student");
const Metric = require("../models/Metric");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Old test data remove
    await Student.deleteMany();
    await Metric.deleteMany();

    // Student 1
    const rahul = await Student.create({
      name: "Rahul Sharma",
      rollNumber: "CSE001",
      className: "CSE-A"
    });

    await Metric.insertMany([
      {
        studentId: rahul._id,
        week: 1,
        attendance: 90,
        marks: 75,
        assignmentsCompleted: 5,
        totalAssignments: 5
      },
      {
        studentId: rahul._id,
        week: 2,
        attendance: 82,
        marks: 70,
        assignmentsCompleted: 4,
        totalAssignments: 5
      },
      {
        studentId: rahul._id,
        week: 3,
        attendance: 72,
        marks: 63,
        assignmentsCompleted: 3,
        totalAssignments: 5
      },
      {
        studentId: rahul._id,
        week: 4,
        attendance: 62,
        marks: 57,
        assignmentsCompleted: 2,
        totalAssignments: 5
      }
    ]);

    // Student 2
    const priya = await Student.create({
      name: "Priya Singh",
      rollNumber: "CSE002",
      className: "CSE-A"
    });

    await Metric.insertMany([
      {
        studentId: priya._id,
        week: 1,
        attendance: 89,
        marks: 82,
        assignmentsCompleted: 5,
        totalAssignments: 5
      },
      {
        studentId: priya._id,
        week: 2,
        attendance: 91,
        marks: 84,
        assignmentsCompleted: 5,
        totalAssignments: 5
      },
      {
        studentId: priya._id,
        week: 3,
        attendance: 92,
        marks: 85,
        assignmentsCompleted: 5,
        totalAssignments: 5
      },
      {
        studentId: priya._id,
        week: 4,
        attendance: 93,
        marks: 87,
        assignmentsCompleted: 5,
        totalAssignments: 5
      }
    ]);

    console.log("Test students added successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();