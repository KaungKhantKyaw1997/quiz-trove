const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(404).json({ message: "User not found." });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions." });
    }
    next();
  };
};

module.exports = { authMiddleware, roleMiddleware };
