// ===============================
// Import required packages
// ===============================
const express = require("express"); // Import Express framework
const connectDB = require("./config/db"); // Import custom DB connection function
const noteRouter = require("./Routes/noteRoutes"); // Import note routes (not used directly here, but imported)

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Initialize the Express application
const app = express();

// ===============================
// Middleware
// ===============================
// Middleware to parse incoming JSON requests
app.use(express.json());

// ===============================
// Connect to the MongoDB database
// ===============================
connectDB(); // Executes the function to connect to MongoDB

// ===============================
// Define API Routes
// ===============================
// Route for authentication (register, login, etc.)
app.use('/api/auth', require('./Routes/auth'));

// Route for notes CRUD operations with role-based access
app.use('/api/notes', require('./Routes/noteRoutes'));

// ===============================
// Start the Express server
// ===============================
// Use port from environment or fallback to 3001
const PORT = process.env.PORT || 3001;

// Start server and listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});