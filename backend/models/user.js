// Import Mongoose to define schema and interact with MongoDB
const mongoose = require('mongoose');

// Import bcrypt for securely hashing passwords
const bcrypt = require('bcryptjs');

// ===========================
// Define the User Schema
// ===========================
const userSchema = new mongoose.Schema({
  // Email field: must be a string, required, and unique across users
  email: { 
    type: String, 
    required: true,       // Cannot create a user without email
    unique: true          // No two users can have the same email
  },

  // Password field (local accounts only)
  password: { 
    type: String, 
    required: function () { return this.provider !== 'google'; }        // Optional for Google SSO users
  },

  name: {
    type: String,
    trim: true
  },

  picture: {
    type: String
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true // allow multiple docs without googleId
  },

  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  }
});

// ===========================
// Pre-save Hook: Hash Password
// ===========================
// This function runs automatically before saving a user document
userSchema.pre('save', async function (next) {
  // If password is missing (Google user) or has not been modified, skip hashing
  if (!this.password || !this.isModified('password')) return next();

  // Hash the password using bcrypt with a salt round of 10
  this.password = await bcrypt.hash(this.password, 10);

  // Proceed to save the document
  next();
});

// ===========================
// Instance Method: Compare Passwords
// ===========================
// Adds a method to user documents for comparing passwords
userSchema.methods.comparePassword = function (password) {
  // Compare input password with the hashed password in the DB
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

// ===========================
// Export the User Model
// ===========================
// Create and export the User model from the schema
// This allows you to use `User` to interact with the "users" collection
module.exports = mongoose.model('User', userSchema);
