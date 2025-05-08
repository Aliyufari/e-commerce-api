"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedRoles = void 0;
const Role_1 = require("../models/Role");
const Permission_1 = require("../models/Permission");
const seedRoles = async () => {
    const permissions = await Permission_1.Permission.find();
    const roles = [
        { name: 'admin', permissions: permissions.map(p => p._id) },
        { name: 'user', permissions: [] },
    ];
    await Role_1.Role.insertMany(roles);
    console.log('Roles seeded!');
};
exports.seedRoles = seedRoles;
