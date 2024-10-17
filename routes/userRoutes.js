const express = require("express");
const {
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *       required:
 *         - username
 *         - password
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [User Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User Management]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: User not found
 *       500:
 *         description: Server error
 */

router.post("/", authMiddleware, roleMiddleware(["superadmin"]), createUser);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["superadmin", "admin"]),
  deleteUser
);

module.exports = router;
