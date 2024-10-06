const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

// Create a new quiz
const createQuiz = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.path : null;
  try {
    const newQuiz = new Quiz({
      title,
      description,
      image,
      createdBy: req.user.id,
    });
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a quiz by ID
const getQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a quiz
const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.file ? req.file.path : undefined;
  try {
    const quizData = {
      title,
      description,
    };
    if (image) {
      quizData.image = image;
    }
    const quiz = await Quiz.findByIdAndUpdate(id, quizData, { new: true });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a quiz
const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    await Question.deleteMany({ quizId: id });

    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createQuiz, getAllQuizzes, getQuiz, updateQuiz, deleteQuiz };
