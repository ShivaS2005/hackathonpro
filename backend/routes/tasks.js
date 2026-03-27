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

// === Task Progress Routes ===

// Add progress to a task
router.post("/:taskId/progress", taskController.addProgress);

// Get all progress entries for a task
router.get("/:taskId/progress", taskController.getTaskProgress);

// Get progress for a specific date
router.get("/:taskId/progress/by-date", taskController.getProgressByDate);

// Update specific progress entry
router.put("/:taskId/progress/:progressId", taskController.updateProgress);

// Delete specific progress entry
router.delete("/progress/:progressId", taskController.deleteProgress);

// Generate PDF report with progress history
router.get("/:taskId/progress-report", taskController.generatePDFReport);

// Download PDF report
router.get("/download-report/:fileName", taskController.downloadPDFReport);

module.exports = router;
