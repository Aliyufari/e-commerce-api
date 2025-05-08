"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const mongoose_1 = require("mongoose");
const roleSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    permissions: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Permission'
        }]
});
exports.Role = (0, mongoose_1.model)('Role', roleSchema);
