// Import the Mongoose model for the 'notes' collection
const UserNote = require("../models/note");

// ==========================
// Get all notes for a user
// ==========================
const getNotes = async (req, res) => {
  // Destructure userId from the authenticated user's object (make sure auth middleware sets req.user properly)
  const { userId } = req.user.id;

  // Extract pagination values from the query string, or use default values
  const { page = 1, limit = 10 } = req.query;

  try {
    // Query the database to find notes created by this user
    // Apply pagination by skipping (page-1) * limit documents and limiting to `limit`
    const notes = await UserNote.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Count total notes for this user (used to calculate total pages)
    const total = await UserNote.countDocuments({ user: userId });

    // Respond with paginated notes and metadata
    res.status(200).json({
      page: Number(page), // current page number
      limit: Number(limit), // number of notes per page
      totalPages: Math.ceil(total / limit), // total pages available
      totalNotes: total, // total number of notes
      notes // actual notes data
    });
  } catch (error) {
    // Catch any errors and return a 500 server error with error details
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// ==========================
// Create a new note
// ==========================
const createNote = async (req, res) => {
  // Destructure the title and content fields from the request body
  const { title, content } = req.body;

  try {
    // Create a new note in the database with the provided data
    const note = await UserNote.create({
      user: req.user.id, // Set the user ID from the authenticated user
      title: req.body.title, // Title of the note
      content: req.body.content // Content of the note
    });

    // Return the created note with a 201 Created status
    res.status(201).json(note);
  } catch (error) {
    // If there's an error (e.g. validation), return a 400 Bad Request with details
    res.status(400).json({ message: "Error creating note", error });
  }
};

// ==========================
// Update a note by ID
// ==========================
const updateNote = async (req, res) => {
  // Get the note's ID from the route parameters
  const id = req.params.id.replace(/^id:/, '');
  try {
    // Update the note by its ID with the new data from the request body
    // The { new: true } option makes sure the updated document is returned
    const note = await UserNote.findByIdAndUpdate(id, req.body, { new: true });

    // Send the updated note back in the response
    res.json(note);
  } catch (error) {
    // Handle errors (e.g. invalid ID or bad data)
    res.status(400).json({ message: "Error updating note", error });
  }
};

// ==========================
// Delete a note by ID
// ==========================
const deleteNote = async (req, res) => {
  // Get the ID of the note to delete from the URL parameters
  const rawId = req.params.id;
  const id = rawId.replace(/^id:/, '');
  try {
    // Delete the note from the database
    await UserNote.findByIdAndDelete(id);

    // Respond with a confirmation message
    res.json({ message: "Note deleted" });
  } catch (error) {
    // Handle errors during deletion (e.g. note not found)
    res.status(400).json({ message: "Error deleting note", error });
  }
};

// Export the CRUD controller functions so they can be used in routes
module.exports = { getNotes, createNote, updateNote, deleteNote };