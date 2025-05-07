import { NextFunction, Request, Response } from "express";
import { Result, ValidationChain, validationResult, ValidationError } from "express-validator";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatus } from "../enums/HttpStatus";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors: Result<ValidationError> = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const formattedErrors = errors.array()
            .reduce((acc: { [key: string]: string }, error: ValidationError) => {
                if (error.type === 'field') {
                    acc[error.path] = error.msg;  
                }
                return acc;
            }, {})

        console.error(formattedErrors);
        res.status(HttpStatusCode.BAD_REQUEST).json(
            new ApiResponse(
                HttpStatusCode.BAD_REQUEST,
                HttpStatus.BAD_REQUEST,
                'Validation errors',
                'errors',
                formattedErrors
            )
        );
    }
};