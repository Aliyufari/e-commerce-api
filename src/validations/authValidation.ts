import { body, param } from 'express-validator';
import mongoose from 'mongoose';

const isValidObjectId = (value: string) => {
  return mongoose.Types.ObjectId.isValid(value);
};

export const authValidation = {
    registerUser: [
        body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        
        body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),
        
        body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        
        body('gender')
        .trim()
        .notEmpty().withMessage('Gender is required')
        .isIn(['Male', 'Female']).withMessage('Invalid gender option'),
        
        body('phone')
        .optional()
        .trim()
        .matches(/^\+?[0-9\s-]+$/).withMessage('Invalid phone number format')
    ],

    loginUser: [
        body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email'),
        
        body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
    ],

    validateUserId: [
        param('id')
        .custom(isValidObjectId).withMessage('Must be a valid MongoDB ID')
    ]
};