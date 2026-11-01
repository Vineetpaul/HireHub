const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
      error: error.message,
    });
  }
};

const optionalProtect = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return next();
  if (!authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized, invalid token format" });
  }

  try {
    const decoded = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "User not found" });
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token failed", error: error.message });
  }
};

module.exports = { protect, optionalProtect };