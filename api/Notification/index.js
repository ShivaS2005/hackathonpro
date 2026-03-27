import express from 'express';
import Notification from '../../models/Notification.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const notifications = await Notification.find().populate('userId taskId employeeId');
  res.json(notifications);
});

router.post('/', async (req, res) => {
  const newNotification = new Notification(req.body);
  await newNotification.save();
  res.json(newNotification);
});

export default router;