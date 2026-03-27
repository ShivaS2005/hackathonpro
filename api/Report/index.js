import express from 'express';
import Report from '../../models/Report.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const reports = await Report.find().populate('taskId generatedBy');
  res.json(reports);
});

router.post('/', async (req, res) => {
  const newReport = new Report(req.body);
  await newReport.save();
  res.json(newReport);
});

export default router;