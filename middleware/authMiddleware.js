const jwt = require('jsonwebtoken');
const User = require("../models/user");

// Main authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user._id,
      role: user.role, // Take role from the database
    };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Role authorization middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role.toLowerCase();
    const allowedRoles = roles.map(role => role.toLowerCase());

    console.log('User role:', userRole);
    console.log('Allowed roles:', allowedRoles);

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not allowed to access this resource`
      });
    }
    next();
  };
};

module.exports = {
  auth,
  authorizeRoles
};