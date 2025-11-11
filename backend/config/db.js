const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri =
      process.env.MONGODB_URI ||               // Cloud or override
      process.env.MONGODB_URI_LOCAL ||         // Optional local var
      "mongodb://127.0.0.1:27017/notesdb";     // Last-resort fallback

    await mongoose.connect(uri, {
      maxPoolSize: 10,            // safe for small servers
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected:", uri.includes("mongodb+srv") ? "Atlas" : "Local");
  } catch (error) {
    console.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;