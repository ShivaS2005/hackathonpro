const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  reportType: {
    type: String,
    enum: ["task_detail", "employee_performance", "completion_rate", "overdue_tasks"],
    default: "task_detail"
  },
  reportData: {
    taskName: String,
    description: String,
    assignedTo: String,
    status: String,
    category: String,
    priority: String,
    dueDate: Date,
    completedAt: Date,
    completionPercentage: Number,
    attachments: [String]
  },
  pdfUrl: {
    type: String,
    default: null
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Report", reportSchema);
