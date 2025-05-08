"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const userValidation_1 = require("../validations/userValidation");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.route('/')
    .get((0, authMiddleware_1.hasRole)('user'), (0, validationMiddleware_1.validate)(userValidation_1.userValidation.pagination), userController_1.index)
    .post((0, validationMiddleware_1.validate)(userValidation_1.userValidation.createUser), userController_1.store);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a single user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user object
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
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
 *         description: User updated
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted
 */
userRouter.route('/:id')
    .get((0, validationMiddleware_1.validate)(userValidation_1.userValidation.userId), userController_1.show)
    .put((0, validationMiddleware_1.validate)([
    ...userValidation_1.userValidation.userId,
    ...userValidation_1.userValidation.updateUser
]), userController_1.update)
    .delete((0, validationMiddleware_1.validate)(userValidation_1.userValidation.userId), userController_1.destroy);
exports.default = userRouter;
