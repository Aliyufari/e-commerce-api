import express, { Application, Request, Response } from "express";
import cors from "cors";
import ip from "ip";
import dotenv from "dotenv";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import { ApiResponse } from "./helpers/ApiResponse";
import { HttpStatus } from "./enums/HttpStatus";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import { connectDB } from "./config/db";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from "./config/swagger";

dotenv.config();

export class App{
    private readonly app: Application;
    constructor(private readonly port: (number | string) = process.env.NODE_PORT || 8000){
        this.app = express();
        this.middilewares();
        this.routes();
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.info(`Server running on: ${ip.address()}:${this.port}`)
        });
    }

    //For Vercel Deployment
    public getApp(): Application {
        return this.app;
    }    

    private middilewares(): void {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        // Connect DB
        this.app.use(async (req: Request, res: Response, next): Promise<void> => {
            try {
                await connectDB();
                next();
            } catch (error) {
                console.error("Database connection error:", error);
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
                    .json(
                        new ApiResponse(
                            HttpStatusCode.INTERNAL_SERVER_ERROR,
                            HttpStatus.INTERNAL_SERVER_ERROR,
                            'Database connection error'
                        )
                    );
            }
        });
    }

    private routes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(HttpStatusCode.OK)
                .json(
                    new ApiResponse(
                        HttpStatusCode.OK,
                        HttpStatus.OK,
                        'Welcome to e-commerce API v1.0'
                    )
                );
        });

        // Auth routes
        this.app.use('/api/auth', authRouter);

        // Users routes
        this.app.use('/api/users', userRouter);

        // Swagger route
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        this.app.all(/(.*)/, (req: Request, res: Response) => {
            res.status(HttpStatusCode.NOT_FOUND)
                .json(
                    new ApiResponse(
                        HttpStatusCode.NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                        'Route does\'t exist on the server.' 
                    )
                );
        });
    }
}