const UserNote = require("../models/note");

// Get all notes
const getNotes = async (req, res) => {
  const { userId } = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  try {
    const notes = await UserNote.find({ user: userId })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await UserNote.countDocuments({ user: userId });
    res.status(200).json({
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
      totalNotes: total,
      notes
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// Create note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await UserNote.create({ title, content });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Error creating note", error });
  }
};

// Update note
const updateNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await UserNote.findByIdAndUpdate(id, req.body, { new: true });
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Error updating note", error });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await UserNote.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting note", error });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };