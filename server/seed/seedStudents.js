const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dns = require("dns");

const Student = require("../models/Student");
const Metric = require("../models/Metric");
const Intervention = require("../models/Intervention");
const Task = require("../models/Task");

const { calculateRisk } = require("../services/riskService");

dotenv.config();

dns.setServers(["8.8.8.8"]);

// ------------------------------------------------
// STUDENT NAMES
// ------------------------------------------------

const names = [
  "Rahul Sharma",
  "Priya Singh",
  "Aman Verma",
  "Neha Yadav",
  "Arjun Kumar",
  "Simran Kaur",
  "Rohit Malik",
  "Anjali Gupta",
  "Karan Mehta",
  "Sneha Rao",

  "Mohit Saini",
  "Pooja Sharma",
  "Aditya Jain",
  "Riya Kapoor",
  "Nitin Kumar",
  "Muskan Verma",
  "Vikas Yadav",
  "Isha Singh",
  "Deepak Hooda",
  "Kavya Sharma",

  "Manish Kumar",
  "Tanvi Gupta",
  "Harsh Vardhan",
  "Sakshi Jain",
  "Abhishek Rana",
  "Mehak Kaur",
  "Yash Mehta",
  "Nisha Yadav",
  "Akash Sharma",
  "Palak Verma",

  "Dev Kumar",
  "Shruti Singh",
  "Sahil Gupta",
  "Aditi Sharma",
  "Rohan Jain",
  "Komal Yadav",
  "Aryan Kapoor",
  "Tanya Verma",
  "Gaurav Kumar",
  "Mansi Singh",

  "Lakshay Sharma",
  "Preeti Gupta",
  "Varun Malik",
  "Nandini Jain",
  "Ankit Yadav",
  "Khushi Verma",
  "Siddharth Kumar",
  "Ritika Sharma",
  "Chirag Mehta",
  "Divya Singh"
];

// ------------------------------------------------
// METRIC PATTERNS
// ------------------------------------------------

const highPatterns = [
  {
    attendance: [90, 84, 76, 64],
    marks: [78, 71, 63, 54],
    assignments: [5, 4, 3, 2]
  },
  {
    attendance: [86, 80, 71, 61],
    marks: [74, 68, 60, 52],
    assignments: [5, 4, 3, 2]
  },
  {
    attendance: [92, 87, 79, 69],
    marks: [82, 76, 65, 58],
    assignments: [5, 4, 3, 2]
  }
];

const mediumPatterns = [
  {
    attendance: [82, 80, 77, 73],
    marks: [76, 72, 68, 64],
    assignments: [5, 5, 4, 4]
  },
  {
    attendance: [84, 81, 78, 74],
    marks: [73, 70, 67, 65],
    assignments: [5, 5, 4, 4]
  },
  {
    attendance: [79, 77, 75, 72],
    marks: [78, 74, 69, 66],
    assignments: [5, 5, 4, 4]
  }
];

const lowPatterns = [
  {
    attendance: [91, 92, 93, 94],
    marks: [78, 80, 82, 84],
    assignments: [5, 5, 5, 5]
  },
  {
    attendance: [88, 90, 89, 91],
    marks: [72, 74, 76, 78],
    assignments: [5, 5, 5, 5]
  },
  {
    attendance: [94, 93, 95, 96],
    marks: [84, 85, 87, 88],
    assignments: [5, 5, 5, 5]
  }
];

// ------------------------------------------------
// CREATE WEEKLY METRICS
// ------------------------------------------------

const createMetrics = async (
  student,
  pattern
) => {
  const metrics = [];

  for (let i = 0; i < 4; i++) {
    const metric = await Metric.create({
      studentId: student._id,
      week: i + 1,
      attendance: pattern.attendance[i],
      marks: pattern.marks[i],
      assignmentsCompleted:
        pattern.assignments[i],
      totalAssignments: 5
    });

    metrics.push(metric);
  }

  return metrics;
};

// ------------------------------------------------
// SEED INTERVENTION HISTORY
// ------------------------------------------------

const createDemoInterventions = async (
  students
) => {
  const examples = [
    {
      student: students[0],
      type: "Mentor Meeting",
      reason:
        "Attendance and marks showed a continuous decline.",
      owner: "Class Mentor",
      outcome: "WORSENED"
    },

    {
      student: students[1],
      type: "Parent Contact",
      reason:
        "Repeated attendance decline required family involvement.",
      owner: "Class Mentor",
      outcome: "IMPROVED"
    },

    {
      student: students[2],
      type: "Remedial Class",
      reason:
        "Academic scores required targeted subject support.",
      owner: "Subject Teacher",
      outcome: "IMPROVED"
    },

    {
      student: students[3],
      type: "Peer Tutoring",
      reason:
        "Student required additional academic assistance.",
      owner: "Subject Teacher",
      outcome: "NO_CHANGE"
    },

    {
      student: students[4],
      type: "Counsellor Referral",
      reason:
        "Multiple risk indicators required additional support.",
      owner: "Counsellor",
      outcome: "IMPROVED"
    }
  ];

  for (const example of examples) {
    await Intervention.create({
      studentId: example.student._id,
      type: example.type,
      reason: example.reason,
      owner: example.owner,
      deadlineDays: 3,
      status: "COMPLETED",
      outcome: example.outcome
    });
  }
};

// ------------------------------------------------
// CREATE SOME ACTIVE TASKS
// ------------------------------------------------

const createDemoTasks = async (
  students
) => {
  const intervention1 =
    await Intervention.create({
      studentId: students[5]._id,
      type: "Parent Contact",
      reason:
        "Attendance has fallen significantly during recent weeks.",
      owner: "Class Mentor",
      deadlineDays: 3,
      status: "APPROVED"
    });

  const deadline1 = new Date();

  deadline1.setDate(
    deadline1.getDate() + 3
  );

  await Task.create({
    interventionId: intervention1._id,
    studentId: students[5]._id,
    title: intervention1.type,
    assignedTo: intervention1.owner,
    deadline: deadline1,
    status: "PENDING"
  });

  const intervention2 =
    await Intervention.create({
      studentId: students[6]._id,
      type: "Remedial Class",
      reason:
        "Marks and assignment completion require academic support.",
      owner: "Subject Teacher",
      deadlineDays: 4,
      status: "APPROVED"
    });

  const deadline2 = new Date();

  deadline2.setDate(
    deadline2.getDate() + 4
  );

  await Task.create({
    interventionId: intervention2._id,
    studentId: students[6]._id,
    title: intervention2.type,
    assignedTo: intervention2.owner,
    deadline: deadline2,
    status: "PENDING"
  });
};

// ------------------------------------------------
// MAIN SEED
// ------------------------------------------------

const seedData = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    // Reset demo database
    await Task.deleteMany();
    await Intervention.deleteMany();
    await Metric.deleteMany();
    await Student.deleteMany();

    console.log("Old demo data removed");

    const createdStudents = [];

    for (
      let index = 0;
      index < names.length;
      index++
    ) {
      let category;
      let pattern;

      /*
        Distribution:

        15 HIGH
        15 MEDIUM
        20 LOW
      */

      if (index < 15) {
        category = "HIGH";

        pattern =
          highPatterns[
            index % highPatterns.length
          ];
      } else if (index < 30) {
        category = "MEDIUM";

        pattern =
          mediumPatterns[
            index % mediumPatterns.length
          ];
      } else {
        category = "LOW";

        pattern =
          lowPatterns[
            index % lowPatterns.length
          ];
      }

      const classNames = [
        "CSE-A",
        "CSE-B",
        "CSE-C"
      ];

      const student =
        await Student.create({
          name: names[index],

          rollNumber:
            "CSE" +
            String(index + 1).padStart(
              3,
              "0"
            ),

          className:
            classNames[
              index % classNames.length
            ]
        });

      const metrics =
        await createMetrics(
          student,
          pattern
        );

      const risk =
        calculateRisk(metrics);

      student.currentRiskScore =
        risk.score;

      student.currentRiskLevel =
        risk.level;

      await student.save();

      createdStudents.push(student);

      console.log(
        `${student.name} -> ${category} / calculated ${risk.level}`
      );
    }

    await createDemoInterventions(
      createdStudents
    );

    await createDemoTasks(
      createdStudents
    );

    console.log("");
    console.log(
      "--------------------------------"
    );

    console.log(
      "50 demo students added successfully"
    );

    console.log(
      "15 High Risk"
    );

    console.log(
      "15 Medium Risk"
    );

    console.log(
      "20 Low Risk"
    );

    console.log(
      "Demo interventions added"
    );

    console.log(
      "Demo tasks added"
    );

    console.log(
      "--------------------------------"
    );

    process.exit(0);

  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

    process.exit(1);
  }
};

seedData();