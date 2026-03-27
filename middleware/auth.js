// Authentication Middleware
const verifyAuthToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    
    // TODO: Verify JWT token
    // If valid, continue to next middleware
    next();
  } catch (error) {
    res.status(401).json({ message: "Token verification failed" });
  }
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
};

module.exports = {
  verifyAuthToken,
  errorHandler
};
