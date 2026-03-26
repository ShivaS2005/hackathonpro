const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Login endpoint
router.post("/login", authController.login);

// Signup endpoint
router.post("/signup", authController.signup);

// Logout endpoint
router.post("/logout", authController.logout);

// Verify token
router.get("/verify", authController.verifyToken);

module.exports = router;
