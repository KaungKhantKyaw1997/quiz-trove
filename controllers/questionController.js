const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const ExcelJS = require("exceljs");

const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { questionText, options, correctAnswer } = req.body;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const newQuestion = new Question({
      quizId,
      questionText,
      options,
      correctAnswer,
      createdBy: req.user.username,
    });

    await newQuestion.save();

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getQuestions = async (req, res) => {
  const { quizId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  try {
    const totalQuestions = await Question.countDocuments({
      quizId,
      recordStatus: { $ne: 4 },
    });

    if (totalQuestions === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this quiz" });
    }

    const quiz = await Quiz.findById(quizId).populate({
      path: "questions",
      match: { recordStatus: { $ne: 4 } },
      options: {
        skip: (options.page - 1) * options.limit,
        limit: options.limit,
      },
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const paginatedQuestions = quiz.questions;
    const totalPages = Math.ceil(totalQuestions / options.limit);

    const randomizedQuestions = shuffleArray(paginatedQuestions);

    const response = {
      totalQuestions,
      currentPage: options.page,
      totalPages: totalPages,
      questions: randomizedQuestions,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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

    const questionData = {
      questionText,
      options,
      correctAnswer,
      recordStatus: 3,
      updatedBy: req.user.username,
    };

    const updatedQuestion = await Question.findByIdAndUpdate(
      questionId,
      questionData,
      {
        new: true,
      }
    );

    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

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

    const questionData = {
      recordStatus: 4,
      updatedBy: req.user.username,
    };

    await Question.findByIdAndUpdate(questionId, questionData, {
      new: true,
    });

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const uploadQuestionsFromExcel = async (req, res) => {
  const { quizId } = req.params;

  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0];
    const questions = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const questionText = row.getCell(1).value;
        const options = row
          .getCell(2)
          .value.split(",")
          .map((opt) => opt.trim());
        const correctAnswer = row.getCell(3).value;

        questions.push({ questionText, options, correctAnswer });
      }
    });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const addedQuestions = [];
    for (const questionData of questions) {
      const newQuestion = new Question({
        quizId,
        questionText: questionData.questionText,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        createdBy: req.user.username,
      });

      await newQuestion.save();
      quiz.questions.push(newQuestion._id);
      addedQuestions.push(newQuestion);
    }
    await quiz.save();

    res.status(201).json({
      message: "Questions uploaded successfully",
      questions: addedQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  uploadQuestionsFromExcel,
};
