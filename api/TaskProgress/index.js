import express from 'express';
import TaskProgress from '../../models/TaskProgress.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const progress = await TaskProgress.find();
  res.json(progress);
});

router.post('/', async (req, res) => {
  const newProgress = new TaskProgress(req.body);
  await newProgress.save();
  res.json(newProgress);
});

export default router;