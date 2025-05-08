"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = void 0;
const Permission_1 = require("../models/Permission");
const seedPermissions = async () => {
    const permissions = [
        { name: 'view-dashboard' },
        { name: 'create-user' },
        { name: 'delete-user' },
    ];
    await Permission_1.Permission.insertMany(permissions);
    console.log('Permissions seeded!');
};
exports.seedPermissions = seedPermissions;
