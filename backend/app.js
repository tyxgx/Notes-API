// ===============================
// Import required packages
// ===============================
const express = require("express"); // Import Express framework
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db"); // Import custom DB connection function
const noteRoutes = require("./Routes/noteRoutes"); // Import note routes (not used directly here, but imported)

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Initialize the Express application
const app = express();

// ===============================
// Middleware
// ===============================
// Middleware to parse incoming JSON requests
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '1mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

// ===============================
// Connect to the MongoDB database
// ===============================
connectDB(); // Executes the function to connect to MongoDB

// ===============================
// Define API Routes
// ===============================
// Route for authentication (register, login, etc.)
app.use('/api/auth', authLimiter, require('./Routes/auth'));

// Route for notes CRUD operations (authenticated users only)
app.use('/api/notes', noteRoutes);
// Route for user management (admin only)

// ===============================
// Start the Express server
// ===============================
// Use port from environment or fallback to 3001
const PORT = process.env.PORT || 3001;

// Start server and listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
