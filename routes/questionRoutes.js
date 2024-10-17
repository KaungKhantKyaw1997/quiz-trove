const express = require("express");
const {
  addQuestion,
  getQuestions,
  updateQuestion,
  deleteQuestion,
  uploadQuestionsFromExcel,
} = require("../controllers/questionController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");
const { uploadExcel } = require("../middlewares/multerConfig");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         questionText:
 *           type: string
 *           description: The question text
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: List of answer options for the question
 *         correctAnswer:
 *           type: integer
 *           description: Index of the correct answer in the options array (0-based)
 *       required:
 *         - questionText
 *         - options
 *         - correctAnswer
 */

/**
 * @swagger
 * /api/v1/quizzes/{quizId}/questions:
 *   post:
 *     summary: Add a question to a quiz
 *     tags: [Questions]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       201:
 *         description: Question added successfully
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{quizId}/questions:
 *   get:
 *     summary: Get all questions of a quiz
 *     tags: [Questions]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number for pagination (default is 1)
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of questions per page (default is 10)
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A paginated list of questions
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{quizId}/questions/{questionId}:
 *   put:
 *     summary: Update a question in a quiz
 *     tags: [Questions]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Question'
 *     responses:
 *       200:
 *         description: Question updated successfully
 *       404:
 *         description: Quiz or Question not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{quizId}/questions/{questionId}:
 *   delete:
 *     summary: Delete a question from a quiz
 *     tags: [Questions]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *       - name: questionId
 *         in: path
 *         required: true
 *         description: The ID of the question
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question deleted successfully
 *       404:
 *         description: Quiz or Question not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{quizId}/questions/upload:
 *   post:
 *     summary: Upload multiple questions from an Excel file
 *     tags: [Questions]
 *     parameters:
 *       - name: quizId
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               excelFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Questions uploaded successfully
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

router.post(
  "/:quizId/questions",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  addQuestion
);
router.get("/:quizId/questions", getQuestions);
router.put(
  "/:quizId/questions/:questionId",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  updateQuestion
);
router.delete(
  "/:quizId/questions/:questionId",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  deleteQuestion
);
router.post(
  "/:quizId/questions/upload",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  uploadExcel.single("excelFile"),
  uploadQuestionsFromExcel
);

module.exports = router;
