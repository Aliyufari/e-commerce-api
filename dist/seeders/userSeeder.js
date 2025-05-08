"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../models/User");
const Role_1 = require("../models/Role");
const seedUsers = async () => {
    const role = await Role_1.Role.findOne({ name: 'user' });
    if (!role) {
        console.error('Role not found!');
        return;
    }
    const hashedPassword = await bcryptjs_1.default.hash('password', 10);
    const users = [
        { name: 'John Doe', email: 'john@example.com', password: hashedPassword, role: role._id },
        { name: 'Jane Doe', email: 'jane@example.com', password: hashedPassword, role: role._id },
    ];
    await User_1.User.insertMany(users);
    console.log('Users seeded!');
};
exports.seedUsers = seedUsers;
