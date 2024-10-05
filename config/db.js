const mongoose = require("mongoose");

const DB_URI =
  "mongodb+srv://kaungkhant19297:P%40ssword@cluster0.sc9fi.mongodb.net/QuizTrove?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
