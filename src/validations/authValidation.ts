import { RequestHandler } from "express";
import { body } from "express-validator";

type ValidationSchema = {
    [key: string]: RequestHandler[];
};

export const authValidation: ValidationSchema = {
    registerUser: [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
            
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
            
        body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage(
                'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            ),
            
        body('gender')
            .trim()
            .notEmpty().withMessage('Gender is required')
            .isIn(['Male', 'Female']).withMessage('Gender must be Male, or Female')
    ],

    loginUser: [
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
            
        body('password')
            .trim()
            .notEmpty().withMessage('Password is required')
    ]
}