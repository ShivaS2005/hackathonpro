import express from 'express';
import AuditLog from '../../models/AuditLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const logs = await AuditLog.find().populate('userId');
  res.json(logs);
});

router.post('/', async (req, res) => {
  const newLog = new AuditLog(req.body);
  await newLog.save();
  res.json(newLog);
});

export default router;