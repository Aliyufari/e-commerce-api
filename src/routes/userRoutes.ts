import { Router } from "express";
import { ValidationChain } from "express-validator";
import { index, store, show, update, destroy } from "../controllers/userController";
import { validate } from "../middlewares/validationMiddleware";
import { userValidation } from "../validations/userValidation";

const userRouter = Router();

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
    .get(validate(userValidation.pagination as ValidationChain[]), index)
    .post(validate(userValidation.createUser as ValidationChain[]), store);

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
    .get(validate(userValidation.userId as ValidationChain[]), show)
    .put(validate([
        ...userValidation.userId as ValidationChain[], 
        ...userValidation.updateUser as ValidationChain[]
    ]), update)
    .delete(validate(userValidation.userId as ValidationChain[]), destroy);

export default userRouter;