"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const ApiResponse_1 = require("../helpers/ApiResponse");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const HttpStatus_1 = require("../enums/HttpStatus");
//@desc     Register User
//@route    POST api/auth/register
//@access   Public
exports.register = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, gender, phone, password } = req.body;
    const avatar = req.file ? req.file.filename : null;
    const userExists = yield User_1.User.findByEmail(email);
    if (userExists) {
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'User already exists'));
        return;
    }
    const phoneExists = yield User_1.User.findOne({ phone: phone });
    if (phoneExists) {
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'Phone already in use'));
        return;
    }
    const role = yield Role_1.Role.findOne({ name: 'user' });
    if (!role) {
        console.error('Role not found');
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'Role not found'));
        return;
    }
    const user = yield User_1.User.create({
        avatar,
        name,
        email,
        phone,
        gender,
        role: role._id,
        password
    });
    if (user) {
        res.status(HttpStatusCode_1.HttpStatusCode.CREATED)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.CREATED, HttpStatus_1.HttpStatus.CREATED, 'User created successfully', 'user', {
            id: user.id,
            avatar: user.avatar ? `/uploads/${user.avatar}` : null,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        }));
        return;
    }
    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
        .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'Invalid data supplied'));
}));
//@desc     Login User
//@route    POST api/auth/login
//@access   Public
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield User_1.User.findByEmail(email);
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.status(HttpStatusCode_1.HttpStatusCode.CREATED)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.CREATED, HttpStatus_1.HttpStatus.CREATED, 'User logged in successfully', 'user', {
            id: user.id,
            avatar: user.avatar ? `/uploads/${user.avatar}` : null,
            name: user.name,
            email: user.email,
            token: generateToken(user.id)
        }));
        return;
    }
    res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
        .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'Invalid credentials'));
}));
const generateToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not set');
    }
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};
