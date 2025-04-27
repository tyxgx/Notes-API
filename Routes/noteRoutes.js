// Import Express framework to create routes
const express = require('express');

// Import jsonwebtoken to handle JWT creation
const jwt = require('jsonwebtoken');

// Import the User model for interacting with the users collection
const User = require('../models/user');

// Create a new router instance from Express
const router = express.Router();

// Import the authentication middleware to protect routes
const { auth } = require('../middleware/authMiddleware');

// =====================================
// Route: POST /register
// Registers a new user
// =====================================
router.post('/register', async (req, res) => {
  const { email, password, role } = req.body; // Extract user details from request body

  try {
    // Create a new user in the database (password is hashed automatically via pre-save hook)
    const user = await User.create({ email, password, role });

    // Respond with success and some user info (excluding password)
    res.status(201).json({ 
      message: 'User created',
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    // Respond with an error if user creation fails (e.g., duplicate email)
    res.status(400).json({ error: 'Registration failed' });
  }
});

// =====================================
// Route: POST /login
// Logs in a user and returns a JWT token
// =====================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Extract credentials from request body

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user is not found or password doesn't match, return unauthorized
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create a JWT with user ID and role, signed using secret key from .env
    const token = jwt.sign(
      { userId: user._id, role: user.role },        // Payload
      process.env.JWT_SECRET,                       // Secret key
      { expiresIn: '1h' }                           // Token expiration time
    );

    // Respond with the token and user info
    res.json({ 
      token,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (err) {
    // Handle unexpected server errors
    res.status(500).json({ error: 'Login failed' });
  }
});

// =====================================
// Route: GET /me
// Returns the authenticated user's info
// =====================================
router.get('/me', auth, async (req, res) => {
  // `auth` middleware ensures the user is authenticated and sets `req.user`
  res.json(req.user); // Respond with authenticated user's info
});

// Export the router to be used in the main server file
module.exports = router;