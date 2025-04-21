const Note = require("../models/note");

// Get all notes
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find();
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};

// Create note
const createNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const note = await Note.create({ title, content });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Error creating note", error });
  }
};

// Update note
const updateNote = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findByIdAndUpdate(id, req.body, { new: true });
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: "Error updating note", error });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  const { id } = req.params;
  try {
    await Note.findByIdAndDelete(id);
    res.json({ message: "Note deleted" });
  } catch (error) {
    res.status(400).json({ message: "Error deleting note", error });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };