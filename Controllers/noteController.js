// Import the Mongoose model for the 'notes' collection
const UserNote = require("../models/note");

// ==========================
// Get all notes for a user
// ==========================
const getNotes = async (req, res) => {
  // Destructure userId from the authenticated user's object (make sure auth middleware sets req.user properly)
  const  userId  = req.user.id;

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
      title, // Title of the note
      content// Content of the note
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
  const id = req.params.id.replace(/^id:/, '');

  try {
    const note = await UserNote.findById(id);

    // 1. Check if note exists
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // 2. Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this note" });
    }

    // 3. Now actually update the fields
    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote
    });

    console.log("Note.user (from DB):", note.user);
    console.log("Note.user (toString):", note.user.toString());
    console.log("Request.user.id (from token):", req.user.id);


    console.log("Updated note before saving:", note);


  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating note", error: error.message });
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