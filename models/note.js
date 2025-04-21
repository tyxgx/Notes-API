const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
}, { timestamps: true });

module.exports = mongoose.model("Note", noteSchema);

const userNoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  content: String
});

module.exports = mongoose.model('UserNote', userNoteSchema);
