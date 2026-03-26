const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Get all tasks
router.get("/", taskController.getAllTasks);

// Get tasks by user
router.get("/user/:userId", taskController.getTasksByUser);

// Get single task
router.get("/:id", taskController.getTaskById);

// Create new task
router.post("/", taskController.createTask);

// Update task
router.put("/:id", taskController.updateTask);

// Mark task as complete
router.patch("/:id/complete", taskController.markTaskComplete);

// Generate PDF report
router.get("/:id/report", taskController.generateReport);

// Delete task
router.delete("/:id", taskController.deleteTask);

module.exports = router;
