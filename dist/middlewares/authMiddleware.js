"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasPermission = exports.hasRole = exports.protect = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const ApiResponse_1 = require("../helpers/ApiResponse");
const HttpStatus_1 = require("../enums/HttpStatus");
// Middleware to protect routes (authentication)
exports.protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                    .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND, 'User not found'));
                return;
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.FORBIDDEN, HttpStatus_1.HttpStatus.FORBIDDEN, 'Unauthorized'));
        }
    }
    else {
        res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.FORBIDDEN, HttpStatus_1.HttpStatus.FORBIDDEN, 'No token provided'));
    }
});
// Middleware to authorize by role
const hasRole = (...roles) => [
    exports.protect,
    (0, express_async_handler_1.default)(async (req, res, next) => {
        const user = await User_1.User.findById(req.user?.id).populate('role');
        if (!user || !roles.includes(user.role.name)) {
            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.FORBIDDEN, HttpStatus_1.HttpStatus.FORBIDDEN, 'Forbidden: Role not allowed'));
        }
        next();
    }),
];
exports.hasRole = hasRole;
// Middleware to authorize by permission
const hasPermission = (permissions) => [
    exports.protect,
    (0, express_async_handler_1.default)(async (req, res, next) => {
        const user = await User_1.User.findById(req.user?.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });
        if (!user) {
            res.status(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.UNAUTHORIZED, HttpStatus_1.HttpStatus.UNAUTHORIZED, 'User not found'));
        }
        const userPermissions = (user?.role).permissions.map((p) => p.name);
        const required = Array.isArray(permissions) ? permissions : [permissions];
        const hasRequired = required.every(p => userPermissions.includes(p));
        if (!hasRequired) {
            res.status(HttpStatusCode_1.HttpStatusCode.FORBIDDEN)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.FORBIDDEN, HttpStatus_1.HttpStatus.FORBIDDEN, 'Forbidden: Permission denied'));
        }
        next();
    }),
];
exports.hasPermission = hasPermission;
