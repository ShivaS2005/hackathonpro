import express from 'express';
import Task from '../../models/Task.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const tasks = await Task.find().populate('assignedBy completedBy');
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

export default router;