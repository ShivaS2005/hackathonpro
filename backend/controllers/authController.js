// Authentication Controller
const User = require("../models/User");
const Employee = require("../models/Employee");

const login = async (req, res) => {
  try {
    const { email, employeeId, password, userType } = req.body;
    
    // Validation
    if (!password || !userType) {
      return res.status(400).json({ message: "Password and user type are required" });
    }

    let user = null;

    if (userType === 'employee') {
      // Employee login with employee ID
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
      }
      
      // Find employee
      const employee = await Employee.findOne({ employeeId }).populate('employerId');
      if (!employee) {
        return res.status(401).json({ message: "Invalid employee ID or password" });
      }

      // Check password - if no password set yet, allow login with any password to trigger signup flow
      if (employee.password && employee.password !== password) {
        return res.status(401).json({ message: "Invalid employee ID or password" });
      }

      user = {
        _id: employee._id,
        name: employee.name,
        email: employee.email || employeeId,
        userType: 'employee',
        employeeId: employee.employeeId,
        employerId: employee.employerId._id
      };
    } else {
      // Employer login with email
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      user = await User.findOne({ email, userType });
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Simple password check (in production, use bcrypt)
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        employeeId: user.employeeId || null,
        employerId: user.employerId || null
      },
      token: "mock-token-" + Date.now()
    });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { email, employeeId, password, name, userType } = req.body;
    
    // Validation
    if (!password || !name || !userType) {
      return res.status(400).json({ message: "Name, password, and user type are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    let newUser = null;

    if (userType === 'employee') {
      // Employee signup with employee ID
      if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
      }

      // Find if employee already exists (created by employer)
      const existingEmployee = await Employee.findOne({ employeeId });
      
      if (!existingEmployee) {
        return res.status(400).json({ message: "Employee ID not found in system. Contact your employer to create your account first." });
      }

      // Check if employee already has a password (already signed up)
      if (existingEmployee.password) {
        return res.status(409).json({ message: "This employee ID is already registered. Please login instead." });
      }

      // Update employee with password and name/email if provided
      newUser = await Employee.findByIdAndUpdate(
        existingEmployee._id,
        {
          name: name || existingEmployee.name,
          password: password,
          email: email || existingEmployee.email || employeeId
        },
        { new: true }
      );

      res.status(201).json({
        message: "Signup successful! You can now login.",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email || employeeId,
          userType: 'employee',
          employeeId: newUser.employeeId,
          employerId: newUser.employerId
        },
        token: "mock-token-" + Date.now()
      });
    } else {
      // Employer signup with email
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email, userType });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists with this email" });
      }

      // Create new user
      newUser = new User({
        name,
        email,
        password, // In production, hash this with bcrypt
        userType
      });

      await newUser.save();

      res.status(201).json({
        message: "Signup successful",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          userType: newUser.userType
        },
        token: "mock-token-" + Date.now()
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Signup failed", error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: "Logout failed", error: error.message });
  }
};

const verifyToken = async (req, res) => {
  try {
    // TODO: Implement token verification
    res.json({ message: "Token is valid" });
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

module.exports = {
  login,
  signup,
  logout,
  verifyToken
};
