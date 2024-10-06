const express = require("express");
const {
  createQuiz,
  getAllQuizzes,
  getQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quizController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerConfig");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *       required:
 *         - title
 */

/**
 * @swagger
 * /api/v1/quizzes:
 *   post:
 *     summary: Create a new quiz
 *     tags: [Quizzes]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Quiz created successfully
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes:
 *   get:
 *     summary: Get all quizzes
 *     tags: [Quizzes]
 *     responses:
 *       200:
 *         description: A list of quizzes
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   get:
 *     summary: Get a quiz by ID
 *     tags: [Quizzes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A quiz object
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   put:
 *     summary: Update a quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - name: id
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
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Quiz updated successfully
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/quizzes/{id}:
 *   delete:
 *     summary: Delete a quiz
 *     tags: [Quizzes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the quiz
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz deleted successfully
 *       404:
 *         description: Quiz not found
 *       500:
 *         description: Server error
 */

router.post("/", authMiddleware, upload.single("image"), createQuiz);
router.get("/", getAllQuizzes);
router.get("/:id", getQuiz);
router.put("/:id", authMiddleware, upload.single("image"), updateQuiz);
router.delete("/:id", authMiddleware, deleteQuiz);

module.exports = router;
