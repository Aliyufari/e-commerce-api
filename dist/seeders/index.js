"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const permissionSeeder_1 = require("./permissionSeeder");
const roleSeeder_1 = require("./roleSeeder");
dotenv_1.default.config();
const seedData = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI || '');
        console.log('Seeding data...');
        await (0, permissionSeeder_1.seedPermissions)();
        await (0, roleSeeder_1.seedRoles)();
        // await seedUsers();
        console.log('Seeding complete ✅');
        process.exit(0);
    }
    catch (err) {
        console.error('Seeding failed ❌', err);
        process.exit(1);
    }
};
seedData();
