import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../helpers/ApiResponse';
import { HttpStatus } from '../enums/HttpStatus';
import { HttpStatusCode } from '../enums/HttpStatusCode';

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

// File filter: allow only images
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Base multer config
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});

// Handle single file upload
export const uploadSingle = (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    upload.single(fieldName)(req, res, (err: any) => {
        if (err) {
            let message = 'File upload error';
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'File size exceeds 2MB limit';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    message = 'Unexpected file upload';
                } else {
                    message = err.message;
                }
            } else if (err?.message) {
                message = err.message;
            }

            return res.status(HttpStatusCode.BAD_REQUEST).json(
                new ApiResponse(
                    HttpStatusCode.BAD_REQUEST,
                    HttpStatus.BAD_REQUEST,
                    message
                )
            );
        }

        next();
    });
};

// Handle multiple file uploads
export const uploadMultiple = (fieldName: string, maxCount: number) => (req: Request, res: Response, next: NextFunction) => {
    upload.array(fieldName, maxCount)(req, res, (err: any) => {
        if (err) {
            let message = 'File upload error';
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'File size exceeds 2MB limit';
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    message = 'Unexpected file upload';
                } else {
                    message = err.message;
                }
            } else if (err?.message) {
                message = err.message;
            }

            return res.status(HttpStatusCode.BAD_REQUEST).json(
                new ApiResponse(
                    HttpStatusCode.BAD_REQUEST,
                    HttpStatus.BAD_REQUEST,
                    message
                )
            );
        }

        next();
    });
};