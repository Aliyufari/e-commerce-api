"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const ApiResponse_1 = require("../helpers/ApiResponse");
const HttpStatus_1 = require("../enums/HttpStatus");
const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            return next();
        }
        const formattedErrors = errors.array()
            .reduce((acc, error) => {
            if (error.type === 'field') {
                acc[error.path] = error.msg;
            }
            return acc;
        }, {});
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'Validation errors', 'errors', formattedErrors));
    };
};
exports.validate = validate;
