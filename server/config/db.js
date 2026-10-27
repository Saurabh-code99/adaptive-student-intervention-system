const mongoose = require("mongoose");
const dns = require("dns");

// Force Node.js to use Google DNS for MongoDB SRV lookup
dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;