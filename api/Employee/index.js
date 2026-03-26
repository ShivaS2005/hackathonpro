import express from 'express';
import Employee from '../../models/Employee.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const employees = await Employee.find().populate('userId employerId');
  res.json(employees);
});

router.post('/', async (req, res) => {
  const newEmp = new Employee(req.body);
  await newEmp.save();
  res.json(newEmp);
});

export default router;