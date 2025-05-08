"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    constructor(statusCode, status, message, key, data) {
        this.timeStamp = new Date().toLocaleString();
        this.statusCode = statusCode;
        this.status = status;
        this.message = message;
        if (key && data !== undefined) {
            this[key] = data;
        }
    }
}
exports.ApiResponse = ApiResponse;
