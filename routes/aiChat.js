const express = require("express");
const router = express.Router();
const aiChatController = require("../controllers/aiChatController");

// Chat endpoint
router.post("/chat", aiChatController.processQuery);

// Get new tasks
router.get("/:userId/new-tasks", aiChatController.getNewTasks);

// Get tasks due today
router.get("/:userId/tasks-today", aiChatController.getTasksDueToday);

// Reschedule priorities
router.patch("/:userId/reschedule", aiChatController.reschedulePriorities);

module.exports = router;
