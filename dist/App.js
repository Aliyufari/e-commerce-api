"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const ip_1 = __importDefault(require("ip"));
const dotenv_1 = __importDefault(require("dotenv"));
const HttpStatusCode_1 = require("./enums/HttpStatusCode");
const ApiResponse_1 = require("./helpers/ApiResponse");
const HttpStatus_1 = require("./enums/HttpStatus");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const db_1 = require("./config/db");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./config/swagger");
dotenv_1.default.config();
class App {
    constructor(port = process.env.NODE_PORT || 8000) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.middilewares();
        this.routes();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.info(`Server running on: ${ip_1.default.address()}:${this.port}`);
        });
    }
    
    middilewares() {
        this.app.use((0, cors_1.default)({ origin: '*' }));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }

    routes() {
        this.app.get('/', (req, res) => {
            res.status(HttpStatusCode_1.HttpStatusCode.OK)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.OK, HttpStatus_1.HttpStatus.OK, 'Welcome to e-commerce API v1.0'));
        });
        
        // Auth routes
        this.app.use('/api/auth', authRoutes_1.default);
        
        // Users routes
        this.app.use('/api/users', userRoutes_1.default);
        
        // Swagger route
        this.app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
        
        this.app.all(/(.*)/, (req, res) => {
            res.status(HttpStatusCode_1.HttpStatusCode.NOT_FOUND)
                .json(new ApiResponse_1.ApiResponse(HttpStatusCode_1.HttpStatusCode.NOT_FOUND, HttpStatus_1.HttpStatus.NOT_FOUND, 'Route does\'t exist on the server.'));
        });
    }
}
exports.App = App;
