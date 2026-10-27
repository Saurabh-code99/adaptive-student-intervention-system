// Load environment variables first
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const interventionRoutes = require("./routes/interventionRoutes");
const taskRoutes = require("./routes/taskRoutes");
const simulationRoutes = require("./routes/simulationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/interventions", interventionRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/simulation", simulationRoutes);
app.use("/api/analytics", analyticsRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Adaptive Student Intervention backend is running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});