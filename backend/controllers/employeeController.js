// Employee Controller
const Employee = require("../models/Employee");

const getAllEmployees = async (req, res) => {
  try {
    const { employerId } = req.query;
    const query = employerId ? { employerId } : {};
    
    const employees = await Employee.find(query).populate("employerId");
    res.json({ 
      employees, 
      total: employees.length 
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees", error: error.message });
  }
};

const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id).populate("employerId");
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    
    res.json({ employee });
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee", error: error.message });
  }
};

const addEmployee = async (req, res) => {
  try {
    const { name, employeeId, designation, email, phone, employerId, userId } = req.body;
    
    // Validation
    if (!name || !employeeId || !designation || !employerId) {
      return res.status(400).json({ message: "Missing required fields: name, employeeId, designation, employerId" });
    }
    
    // Check if employee ID already exists
    const existingEmployee = await Employee.findOne({ employeeId });
    if (existingEmployee) {
      return res.status(409).json({ message: "Employee ID already exists" });
    }

    const newEmployee = new Employee({
      name,
      employeeId,
      designation,
      email: email || '',
      phone: phone || null,
      employerId,
      userId: userId || employerId  // Use userId if provided, otherwise use employerId
    });

    await newEmployee.save();

    res.status(201).json({
      message: "Employee added successfully",
      employee: newEmployee
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding employee", error: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const employee = await Employee.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee updated successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee", error: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.findByIdAndDelete(id);
    
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee", error: error.message });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee
};
