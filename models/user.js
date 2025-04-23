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

  // Password field: must be a string and is required
  password: { 
    type: String, 
    required: true        // Cannot create a user without password
  },

  // Role field: used for Role-Based Access Control (RBAC)
  role: {
    type: String, 
    enum: ['reader', 'creator', 'editor', 'admin'], // Allowed role values
    default: 'reader'      // Default role assigned if not specified
  }
});

// ===========================
// Pre-save Hook: Hash Password
// ===========================
// This function runs automatically before saving a user document
userSchema.pre('save', async function (next) {
  // If password has not been modified, skip hashing
  if (!this.isModified('password')) return next();

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
  return bcrypt.compare(password, this.password);
};

// ===========================
// Export the User Model
// ===========================
// Create and export the User model from the schema
// This allows you to use `User` to interact with the "users" collection
module.exports = mongoose.model('User', userSchema);