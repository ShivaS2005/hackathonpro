// models/AIChat.js
const mongoose = require("mongoose");

const aiChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userMessage: {
    type: String,
    required: true,
  },
  aiResponse: {
    type: String,
    required: true,
  },
  queryType: {
    type: String,
    enum: ["new_tasks", "tasks_today", "reschedule", "general_query"],
    default: "general_query",
  },
  relatedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
  helpful: {
    type: Boolean,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent model overwrite errors in serverless functions
module.exports = mongoose.models.AIChat || mongoose.model("AIChat", aiChatSchema);
