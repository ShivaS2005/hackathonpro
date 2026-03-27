const mongoose = require("mongoose");

const deadlineReminderSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },
  reminderDate: {
    type: Date,
    required: true
  },
  reminderType: {
    type: String,
    enum: ["24_hours", "12_hours", "6_hours", "1_hour", "overdue"],
    default: "24_hours"
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date,
    default: null
  },
  acknowledged: {
    type: Boolean,
    default: false
  },
  acknowledgedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("DeadlineReminder", deadlineReminderSchema);
