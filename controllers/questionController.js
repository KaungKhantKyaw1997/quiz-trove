const Question = require("../models/Question");
const Quiz = require("../models/Quiz");

// Add a question to a quiz
const addQuestion = async (req, res) => {
  const { id } = req.params;
  const { questionText, options, correctAnswer } = req.body;
  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const newQuestion = new Question({ questionText, options, correctAnswer });
    quiz.questions.push(newQuestion);
    await newQuestion.save();
    await quiz.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all questions of a quiz with pagination
const getQuestions = async (req, res) => {
  const { id } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const totalQuestions = quiz.questions.length;

    const questions = await Quiz.findById(id)
      .populate({
        path: "questions",
        options: {
          skip: (options.page - 1) * options.limit,
          limit: options.limit,
        },
      })
      .then((quiz) => quiz.questions);

    const totalPages = Math.ceil(totalQuestions / options.limit);

    const response = {
      totalQuestions,
      currentPage: options.page,
      totalPages: totalPages,
      questions: questions,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a question in a quiz
const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  const { questionText, options, correctAnswer } = req.body;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    question.questionText = questionText;
    question.options = options;
    question.correctAnswer = correctAnswer;
    await question.save();
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a question from a quiz
const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    quiz.questions = quiz.questions.filter(
      (q) => q._id.toString() !== questionId
    );
    await quiz.save();
    await Question.findByIdAndDelete(questionId);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { addQuestion, getQuestions, updateQuestion, deleteQuestion };
