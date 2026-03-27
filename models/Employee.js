// models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
  },
  designation: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
    lowercase: true,
  },
  password: {
    type: String,
    default: null,
  },
  phone: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dateOfJoining: {
    type: Date,
    default: Date.now,
  },
  performanceScore: {
    type: Number,
    default: 0,
  },
  totalTasksCompleted: {
    type: Number,
    default: 0,
  },
  totalTasksPending: {
    type: Number,
    default: 0,
  },
  totalTasksOverdue: {
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
module.exports = mongoose.models.Employee || mongoose.model("Employee", employeeSchema);
