const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: Number, required: true },
  recordStatus: { type: Number, default: 2 }, // 2 = Created, 3 = Updated, 4 = Deleted
  createdBy: { type: String },
  updatedBy: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

QuestionSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Question = mongoose.model("Question", QuestionSchema);
module.exports = Question;
