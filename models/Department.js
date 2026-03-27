// models/Department.js
const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  employeeCount: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite errors in serverless functions
module.exports = mongoose.models.Department || mongoose.model("Department", departmentSchema);
