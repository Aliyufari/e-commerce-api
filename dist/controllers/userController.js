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
exports.destroy = exports.update = exports.show = exports.store = exports.index = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ApiResponse_1 = require("../helpers/ApiResponse");
const HttpStatus_1 = require("../enums/HttpStatus");
const HttpStatusCode_1 = require("../enums/HttpStatusCode");
const User_1 = require("../models/User");
//@desc     Get users' list
//@route    GET api/users
//@access   Private
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;
        const sort = {};
        sort[sortField] = sortOrder;
        const filter = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.gender) {
            filter.gender = req.query.gender;
        }
        const options = {
            page,
            limit,
            sort,
            select: '-password',
            lean: true
        };
        const result = yield User_1.User.paginate(filter, options);
        res.status(HttpStatusCode_1.HttpStatusCode.OK)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.OK, HttpStatus_1.HttpStatus.OK, 'Users fetched successfully', 'data', {
            users: result.docs,
            links: {
                total: result.totalDocs,
                page: result.page,
                pages: result.totalPages,
                limit: result.limit,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage,
                nextPage: result.nextPage,
                prevPage: result.prevPage
            }
        }));
    }
    catch (error) {
        console.error('Pagination error:', error);
        res.status(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.INTERNAL_SERVER_ERROR, HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users'));
    }
});
exports.index = index;
//@desc     Add new user
//@route    POST api/users
//@access   Private
exports.store = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { avatar, name, email, gender, password } = req.body;
    const userExists = yield User_1.User.findByEmail(email);
    if (userExists) {
        res.status(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST)
            .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.BAD_REQUEST, HttpStatus_1.HttpStatus.BAD_REQUEST, 'User already exists'));
    }
    const user = yield User_1.User.create({
        name,
        email,
        gender,
        password
    });
    res.status(HttpStatusCode_1.HttpStatusCode.CREATED)
        .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.CREATED, HttpStatus_1.HttpStatus.CREATED, 'User created successfully', 'user', user));
}));
//@desc     Get single user
//@route    GET api/users/id
//@access   Private
const show = (req, res) => {
};
exports.show = show;
const update = (req, res) => {
};
exports.update = update;
const destroy = (req, res) => {
};
exports.destroy = destroy;
