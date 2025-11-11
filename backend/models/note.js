// Import Mongoose library to define a schema and interact with MongoDB
const mongoose = require("mongoose");

// Define the schema for user notes
const userNoteSchema = new mongoose.Schema({
  // Reference to the user who owns this note
  // 'ref: "User"' allows population of user details from the User collection
  user: { 
    type: mongoose.Schema.Types.ObjectId, // MongoDB ID type
    ref: 'User',                          // Reference to the User model
    required: true                        // This field must be present
  },

  // Title of the note (required field)
  title: { 
    type: String, 
    required: true                       // Must have a title
  },

  // Content/body of the note (optional field)
  content: String,

  // Board layout fields
  x: { type: Number, default: 16 },
  y: { type: Number, default: 16 },
  z: { type: Number, default: 0 },
  color: { type: String, default: 'yellow' },
  rotation: { type: Number, default: () => (Math.random() * 4 - 2) }, // -2..2 deg
  pinned: { type: Boolean, default: false },

  // Organization fields
  tags: { type: [String], default: [] },
  archived: { type: Boolean, default: false },
  archivedAt: { type: Date, default: null }
},
  // Schema options object
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true
  }
);

userNoteSchema.index({ user: 1, updatedAt: -1 });
userNoteSchema.index({ user: 1, archived: 1 });
userNoteSchema.index({ user: 1, tags: 1 });
userNoteSchema.index({ title: 'text', content: 'text' });

// Create and export the Mongoose model for the 'user notes' collection
// This allows you to use `UserNote` to interact with the collection in the database
module.exports = mongoose.model('UserNote', userNoteSchema);
