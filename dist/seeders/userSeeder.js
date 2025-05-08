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
exports.seedUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const seedUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield Role_1.Role.findOne({ name: 'user' });
    if (!role) {
        console.error('Role not found!');
        return;
    }
    const hashedPassword = yield bcryptjs_1.default.hash('password', 10);
    const users = [
        { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: role._id },
        { name: 'Jane Doe', email: 'jane@example.com', password: hashedPassword, role: role._id },
    ];
    yield User_1.User.insertMany(users);
    console.log('Users seeded!');
});
exports.seedUsers = seedUsers;
