import express from 'express';
import Department from '../../models/Department.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const departments = await Department.find().populate('manager');
  res.json(departments);
});

router.post('/', async (req, res) => {
  const newDept = new Department(req.body);
  await newDept.save();
  res.json(newDept);
});

export default router;