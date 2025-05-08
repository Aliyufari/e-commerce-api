"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const express_validator_1 = require("express-validator");
exports.userValidation = {
    createUser: [
        (0, express_validator_1.body)('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
            .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
        (0, express_validator_1.body)('gender')
            .trim()
            .notEmpty().withMessage('Gender is required')
            .isIn(['Male', 'Female']).withMessage('Gender must be Male, or Female'),
        (0, express_validator_1.body)('role')
            .isMongoId().withMessage('Role must be a valid MongoDB ID')
    ],
    updateUser: [
        (0, express_validator_1.body)('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('email')
            .optional()
            .trim()
            .isEmail().withMessage('Must be a valid email address')
            .normalizeEmail(),
        (0, express_validator_1.body)('gender')
            .optional()
            .trim()
            .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
    ],
    userId: [
        (0, express_validator_1.param)('id')
            .notEmpty().withMessage('User ID is required')
            .isMongoId().withMessage('Must be a valid MongoDB ID')
    ],
    pagination: [
        (0, express_validator_1.query)('page')
            .optional()
            .isInt({ min: 1 }).withMessage('Page must be a positive integer')
            .toInt(),
        (0, express_validator_1.query)('limit')
            .optional()
            .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
            .toInt()
    ]
};
