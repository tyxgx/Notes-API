const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authMiddleware');
const Note = require('../models/note');

const sanitizeTags = (raw = []) => {
  if (!Array.isArray(raw)) return [];
  return Array.from(new Set(raw.map(tag => tag && tag.toString().trim()).filter(Boolean))).slice(0, 20);
};

// Apply authentication middleware to all note routes
router.use(auth);

/**
 * @route   GET /api/notes
 * @desc    Get paginated notes for the authenticated user
 * @access  Private
 * @query   page (default: 1), limit (default: 10)
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, q = '', tags, archived } = req.query;
    const filter = { user: req.user.id };

    if (archived === 'true') {
      filter.archived = true;
    } else if (archived === 'all') {
      // no archived filter
    } else {
      filter.archived = false;
    }

    if (tags) {
      const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (tagList.length) {
        filter.tags = { $all: tagList };
      }
    }

    let finalFilter = { ...filter };
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), 'i');
      finalFilter = {
        ...filter,
        $or: [
          { title: regex },
          { content: regex },
          { tags: { $elemMatch: { $regex: regex } } }
        ]
      };
    }

    const numericLimit = Math.min(Number(limit) || 10, 200);
    const numericPage = Math.max(Number(page) || 1, 1);

    const notes = await Note.find(finalFilter)
      .limit(numericLimit)
      .skip((numericPage - 1) * numericLimit)
      .sort({ updatedAt: -1 });

    const count = await Note.countDocuments(finalFilter);

    res.json({
      notes,
      totalPages: Math.ceil(count / numericLimit),
      currentPage: numericPage,
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
 * @route   GET /api/notes/:id
 * @desc    Get a single note by ID (owner only)
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this note' });
    }
    res.json({ success: true, note });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while fetching note', error: err.message });
  }
});

/**
 * @route   POST /api/notes
 * @desc    Create a new note for the authenticated user
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { title = '', content = '', archived = false } = req.body;
    const tags = sanitizeTags(req.body.tags);

    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    if (title.length > 200) {
      return res.status(400).json({ success: false, message: 'Title must be 200 characters or fewer' });
    }
    if (content.length > 5000) {
      return res.status(400).json({ success: false, message: 'Content must be 5000 characters or fewer' });
    }

    const note = await Note.create({
      user: req.user.id,
      title: title.trim(),
      content: content.trim(),
      tags,
      archived,
      archivedAt: archived ? new Date() : null,
      x: req.body.x,
      y: req.body.y,
      z: req.body.z,
      color: req.body.color,
      rotation: req.body.rotation,
      pinned: req.body.pinned
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
 * @desc    Update a note (owner only)
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title = '', content = '', pinned } = req.body;
    const tags = sanitizeTags(req.body.tags);

    if (!title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    if (title.length > 200) {
      return res.status(400).json({ success: false, message: 'Title must be 200 characters or fewer' });
    }
    if (content.length > 5000) {
      return res.status(400).json({ success: false, message: 'Content must be 5000 characters or fewer' });
    }

    let note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Verify note belongs to user
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this note'
      });
    }

    note.title = title.trim();
    note.content = content.trim();
    if (Array.isArray(tags)) note.tags = tags;
    if (typeof pinned === 'boolean') note.pinned = pinned;
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
 * @route   PATCH /api/notes/:id/position
 * @desc    Update note position and layer (owner only)
 * @access  Private
 */
router.patch('/:id/position', async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y, z } = req.body;
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to move this note' });
    }
    if (typeof x === 'number') note.x = x;
    if (typeof y === 'number') note.y = y;
    note.z = typeof z === 'number' ? z : Date.now();
    const updated = await note.save();
    res.json({ success: true, note: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating position', error: err.message });
  }
});

/**
 * @route   PATCH /api/notes/:id/style
 * @desc    Update note style (color, rotation, pinned)
 * @access  Private
 */
router.patch('/:id/style', async (req, res) => {
  try {
    const { id } = req.params;
    const { color, rotation, pinned } = req.body;
    const tags = sanitizeTags(req.body.tags);
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });
    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to style this note' });
    }
    const allowedColors = ['yellow','mint','lilac','coral','sky'];
    if (typeof color === 'string' && allowedColors.includes(color)) note.color = color;
    if (typeof rotation === 'number' && rotation >= -10 && rotation <= 10) note.rotation = rotation;
    if (typeof pinned === 'boolean') note.pinned = pinned;
    if (Array.isArray(tags)) note.tags = tags;
    const updated = await note.save();
    res.json({ success: true, note: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while updating style', error: err.message });
  }
});

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete a note (owner only)
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
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

/**
 * @route   PATCH /api/notes/:id/archive
 * @desc    Archive or restore a note (owner only)
 * @access  Private
 */
router.patch('/:id/archive', async (req, res) => {
  try {
    const { id } = req.params;
    const { archived } = req.body;
    const note = await Note.findById(id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this note' });
    }

    note.archived = Boolean(archived);
    note.archivedAt = note.archived ? new Date() : null;
    const updated = await note.save();
    res.json({ success: true, note: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error while archiving note', error: err.message });
  }
});

module.exports = router;
