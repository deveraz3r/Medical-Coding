const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No Token Provided" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action"
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
