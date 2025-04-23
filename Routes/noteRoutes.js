// Import Express framework to define routes
const express = require("express");

// Create a new Express router instance
const router = express.Router();

// Import note controller functions for CRUD operations
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../Controllers/noteController");

// Import authentication and role-based authorization middleware
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

// ===============================
// GET /notes
// Route to get all notes for a user
// Only accessible to roles: reader, creator, editor, admin
// ===============================
router.get(
  '/',
  auth, // Ensure the user is authenticated
  authorizeRoles('reader', 'creator', 'editor', 'admin'), // Authorize based on role
  getNotes // Controller function to get notes
);

// ===============================
// POST /notes
// Route to create a new note
// Only accessible to roles: creator, admin
// ===============================
router.post(
  '/',
  auth, // Authenticate the user
  authorizeRoles('creator', 'admin'), // Only creators and admins can create notes
  createNote // Controller function to handle note creation
);

// ===============================
// PUT /notes/:id
// Route to update a note by its ID
// Only accessible to roles: editor, admin
// ===============================
router.put(
  '/:id',
  auth, // Authenticate the user
  authorizeRoles('editor', 'admin'), // Only editors and admins can update notes
  updateNote // Controller function to handle note updates
);

// ===============================
// DELETE /notes/:id
// Route to delete a note by its ID
// Only accessible to role: admin
// ===============================
router.delete(
  '/:id',
  auth, // Authenticate the user
  authorizeRoles('admin'), // Only admins can delete notes
  deleteNote // Controller function to handle note deletion
);

// ===============================
// Export the router to be used in the main server app
// ===============================
module.exports = router;