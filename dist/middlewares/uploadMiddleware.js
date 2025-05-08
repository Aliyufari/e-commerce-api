"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultiple = exports.uploadSingle = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ApiResponse_1 = require("../helpers/ApiResponse");
const HttpStatus_1 = require("../enums/HttpStatus");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
// Ensure uploads directory exists
const uploadDir = path_1.default.join(__dirname, '../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
// Configure storage
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
// File filter: allow only images
const fileFilter = (_req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        cb(null, true);
    }
    else {
        cb(new Error('Only image files are allowed'));
    }
};
// Base multer config
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
});
// Handle single file upload
const uploadSingle = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err) {
            let message = 'File upload error';
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'File size exceeds 2MB limit';
                }
                else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    message = 'Unexpected file upload';
                }
                else {
                    message = err.message;
                }
            }
            else if (err === null || err === void 0 ? void 0 : err.message) {
                message = err.message;
            }
            return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, message));
        }
        next();
    });
};
exports.uploadSingle = uploadSingle;
// Handle multiple file uploads
const uploadMultiple = (fieldName, maxCount) => (req, res, next) => {
    upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
            let message = 'File upload error';
            if (err instanceof multer_1.default.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    message = 'File size exceeds 2MB limit';
                }
                else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    message = 'Unexpected file upload';
                }
                else {
                    message = err.message;
                }
            }
            else if (err === null || err === void 0 ? void 0 : err.message) {
                message = err.message;
            }
            return res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST).json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, message));
        }
        next();
    });
};
exports.uploadMultiple = uploadMultiple;
