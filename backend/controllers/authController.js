// Authentication Controller

// Simple in-memory user store (replace with database)
const users = [];

const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    
    // Validation
    if (!email || !password || !userType) {
      return res.status(400).json({ message: "Email, password, and user type are required" });
    }

    // Find user (replace with database query)
    const user = users.find(u => u.email === email && u.userType === userType);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Simple password check (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType
      },
      token: "mock-token-" + Date.now()
    });
  } catch (error) {
    res.status(400).json({ message: "Login failed", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { email, password, name, userType } = req.body;
    
    // Validation
    if (!email || !password || !name || !userType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email && u.userType === userType);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email" });
    }

    // Create new user (replace with database)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In production, hash this with bcrypt
      userType,
      createdAt: new Date()
    };

    users.push(newUser);

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType
      },
      token: "mock-token-" + Date.now()
    });
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
