const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Get all notifications for user
router.get("/:userId", notificationController.getNotifications);

// Mark notification as read
router.patch("/:id/read", notificationController.markAsRead);

// Delete notification
router.delete("/:id", notificationController.deleteNotification);

// Send notification
router.post("/", notificationController.sendNotification);

module.exports = router;
