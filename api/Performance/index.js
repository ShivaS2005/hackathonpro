import express from 'express';
import Performance from '../../models/Performance.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const performances = await Performance.find().populate('employeeId evaluatedBy');
  res.json(performances);
});

router.post('/', async (req, res) => {
  const newPerf = new Performance(req.body);
  await newPerf.save();
  res.json(newPerf);
});

export default router;