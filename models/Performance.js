const mongoose = require("mongoose");

const performanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  totalTasksAssigned: {
    type: Number,
    default: 0
  },
  totalTasksCompleted: {
    type: Number,
    default: 0
  },
  totalTasksOverdue: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number,
    default: 0
  },
  tasksCategoryWise: {
    urgent: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    least: { type: Number, default: 0 }
  },
  performanceScore: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String,
    default: ""
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Performance", performanceSchema);
