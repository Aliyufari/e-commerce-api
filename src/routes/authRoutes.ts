import { Router } from "express";
import { login, register } from "../controllers/authController";
import userRouter from "./userRoutes";
import { validate } from "../middlewares/validationMiddleware";
import { authValidation } from "../validations/authValidation";
import { ValidationChain } from "express-validator";

const authRouter = Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered
 */
authRouter.route('/register').post(validate(authValidation.registerUser as ValidationChain[]), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User logged in
 */
authRouter.route('/login').post(validate(authValidation.loginUser as ValidationChain[]), login);

export default userRouter