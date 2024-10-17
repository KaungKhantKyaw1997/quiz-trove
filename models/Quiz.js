const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String, required: true },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  recordStatus: { type: Number, default: 2 }, // 2 = Created, 3 = Updated, 4 = Deleted
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

QuizSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
