"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const init = () => {
    const appInstance = new App_1.App();
    if (process.env.NODE_ENV !== 'production') {
        appInstance.listen();
    }
    return appInstance.getApp();
};
const app = init();
exports.default = app;
