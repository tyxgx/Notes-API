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
  content: String
},
  // Schema options object
  {
    // Automatically adds `createdAt` and `updatedAt` fields
    timestamps: true
  }
);

// Create and export the Mongoose model for the 'user notes' collection
// This allows you to use `UserNote` to interact with the collection in the database
module.exports = mongoose.model('UserNote', userNoteSchema);