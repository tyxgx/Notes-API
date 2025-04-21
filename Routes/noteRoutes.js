const express = require("express");
const router = express.Router();
const { getAllNotes } = require("../Controllers/noteController");


const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} = require("../Controllers/noteController");

const { auth, authorizeRoles } = require('../middleware/authMiddleware');

router.get(
  '/',
  auth,
  authorizeRoles('reader', 'creator', 'editor', 'admin'),
  getNotes
);

router.post(
  '/',
  auth,
  authorizeRoles('creator', 'admin'),
  createNote
);

router.put(
  '/:id',
  auth,
  authorizeRoles('editor', 'admin'),
  updateNote
);

router.delete(
  '/:id',
  auth,
  authorizeRoles('admin'),
  deleteNote
);

module.exports = router;