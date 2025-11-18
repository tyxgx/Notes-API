// Import Express framework to create routes
const express = require('express');

// Import jsonwebtoken to handle JWT creation
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// Import the User model for interacting with the users collection
const User = require('../models/user');

// Create a new router instance from Express
const router = express.Router();

// Import the authentication middleware to protect routes
const { auth } = require('../middleware/authMiddleware');

const googleClient = process.env.GOOGLE_CLIENT_ID
  ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  : null;

const toSafeUser = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  picture: user.picture
});

const signJwtForUser = (user) => jwt.sign(
  { userId: user._id },                         // Payload
  process.env.JWT_SECRET,                       // Secret key
  { expiresIn: '1h' }                           // Token expiration time
);

// =====================================
// Route: POST /register
// Registers a new user
// =====================================
router.post('/register', async (req, res) => {
  const { email, password } = req.body; // Extract user details from request body

  try {
    // Create a new user in the database (password is hashed automatically via pre-save hook)
    const user = await User.create({ email, password });

    // Respond with success and some user info (excluding password)
    res.status(201).json({ 
      message: 'User created',
      user: toSafeUser(user)
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

    // Create a JWT with user ID, signed using secret key from .env
    const token = signJwtForUser(user);

    // Respond with the token and user info
    res.json({ 
      token,
      user: toSafeUser(user)
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

// =====================================
// Route: POST /google
// Handles Google ID token exchange
// =====================================
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ error: 'ID token is required' });
    }
    if (!googleClient) {
      return res.status(500).json({ error: 'Google auth is not configured' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture, email_verified: emailVerified } = payload || {};

    if (!email || !emailVerified) {
      return res.status(401).json({ error: 'Google account email is not verified' });
    }

    let user = await User.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await User.create({
        email,
        name,
        picture,
        googleId: sub,
        provider: 'google'
      });
    } else {
      user.googleId = sub;
      user.provider = 'google';
      if (name) user.name = name;
      if (picture) user.picture = picture;
      await user.save();
    }

    const token = signJwtForUser(user);
    res.json({
      token,
      user: toSafeUser(user)
    });
  } catch (err) {
    console.error('Google auth error:', err.message);
    res.status(401).json({ error: 'Google sign-in failed' });
  }
});

// Export the router to be used in the main server file
module.exports = router;
