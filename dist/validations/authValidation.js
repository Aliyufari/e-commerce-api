"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const express_validator_1 = require("express-validator");
const mongoose_1 = __importDefault(require("mongoose"));
const isValidObjectId = (value) => {
    return mongoose_1.default.Types.ObjectId.isValid(value);
};
exports.authValidation = {
    registerUser: [
        (0, express_validator_1.body)('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email'),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        (0, express_validator_1.body)('gender')
            .trim()
            .notEmpty().withMessage('Gender is required')
            .isIn(['Male', 'Female']).withMessage('Invalid gender option'),
        (0, express_validator_1.body)('phone')
            .optional()
            .trim()
            .matches(/^\+?[0-9\s-]+$/).withMessage('Invalid phone number format')
    ],
    loginUser: [
        (0, express_validator_1.body)('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please enter a valid email'),
        (0, express_validator_1.body)('password')
            .trim()
            .notEmpty().withMessage('Password is required')
    ],
    validateUserId: [
        (0, express_validator_1.param)('id')
            .custom(isValidObjectId).withMessage('Must be a valid MongoDB ID')
    ]
};
