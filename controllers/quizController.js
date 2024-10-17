const Quiz = require("../models/Quiz");
const Question = require("../models/Question");

const createQuiz = async (req, res) => {
  const { title, description } = req.body;
  const image = req.file ? req.file.buffer.toString("base64") : null;

  try {
    const newQuiz = new Quiz({
      title,
      description,
      image,
      createdBy: req.user.username,
    });

    await newQuiz.save();

    res.status(201).json(newQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllQuizzes = async (req, res) => {
  const { search } = req.query;

  try {
    let quizzes;
    if (search && search.trim()) {
      quizzes = await Quiz.find({
        title: { $regex: search, $options: "i" },
        recordStatus: { $ne: 4 },
      });
    } else {
      quizzes = await Quiz.find({ recordStatus: { $ne: 4 } });
    }

    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findOne({ _id: id, recordStatus: { $ne: 4 } });
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const image = req.file ? req.file.buffer.toString("base64") : undefined;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizData = {
      title,
      description,
      recordStatus: 3,
      updatedBy: req.user.username,
    };

    if (image) {
      quizData.image = image;
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(id, quizData, {
      new: true,
    });

    res.json(updatedQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;

  try {
    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const quizData = {
      recordStatus: 4,
      updatedBy: req.user.username,
    };

    await Quiz.findByIdAndUpdate(id, quizData, { new: true });

    const questionData = {
      recordStatus: 4,
      updatedBy: req.user.username,
    };

    await Question.updateMany({ quizId: id }, questionData);

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createQuiz, getAllQuizzes, getQuiz, updateQuiz, deleteQuiz };
