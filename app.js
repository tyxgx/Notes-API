const express = require("express");
const connectDB = require("./config/db"); // Assuming your DB connection is in config
const noteRouter = require("./Routes/noteRoutes");

require('dotenv').config();

const app = express();

// Middleware
app.use(express.json()); // For parsing application/json

// Connect to the database
connectDB();

// Routes
// app.use("/api/notes", noteRouter);
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/notes', require('./Routes/noteRoutes'));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

