const express = require('express');
const router = express.Router();
const { auth, authorizeRoles } = require('../middleware/authMiddleware');
const Note = require('../models/note');

// Apply authentication middleware to all note routes
router.use(auth);

/**
 * @route   GET /api/notes
 * @desc    Get paginated notes (accessible to all authenticated roles)
 * @access  Private (reader, creator, editor, admin)
 * @query   page (default: 1), limit (default: 10)
 */
router.get('/', authorizeRoles('reader', 'creator', 'editor', 'admin'), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const notes = await Note.find({ user: req.user.id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Note.countDocuments({ user: req.user.id });

    res.json({
      notes,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalNotes: count
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching notes',
      error: err.message 
    });
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note (accessible to creator and admin roles)
 * @access  Private (creator, admin)
 */
router.post('/', authorizeRoles('creator', 'admin'), async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content
    });

    res.status(201).json({
      success: true,
      note
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating note',
      error: err.message
    });
  }
});

/**
 * @route   PUT /api/notes/:id
 * @desc    Update a note (accessible to editor and admin roles)
 * @access  Private (editor, admin)
 */
router.put('/:id', authorizeRoles('editor', 'admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    let note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    console.log('note.user:', note.user.toString());
    console.log('req.user.id:', req.user.id);


    // Verify note belongs to user
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note.title = title;
    note.content = content;
    const updatedNote = await note.save();

    res.json({
      success: true,
      note: updatedNote
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating note',
      error: err.message
    });
  }
});

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note (accessible only to admin role)
 * @access  Private (admin)
 */
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Verify note belongs to user (even admins can only delete their own notes)
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this note'
      });
    }

    await Note.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Server error while deleting note',
      error: err.message
    });
  }
});

module.exports = router;