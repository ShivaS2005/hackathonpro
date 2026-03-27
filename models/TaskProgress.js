// models/TaskProgress.js
const mongoose = require("mongoose");

const taskProgressSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  employeeId: {
    type: String,
    required: true,
  },
  progressDate: {
    type: Date,
    required: true,
  },
  progressPercentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  progressDescription: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    default: "",
  },
  attachments: [
    {
      fileName: String,
      fileUrl: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient querying
taskProgressSchema.index({ taskId: 1, progressDate: 1 });
taskProgressSchema.index({ employeeId: 1, taskId: 1 });

// Prevent model overwrite errors in serverless functions
module.exports = mongoose.models.TaskProgress || mongoose.model("TaskProgress", taskProgressSchema);
