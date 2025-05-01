import express, { Application, Request, Response } from "express";
import cors from "cors";
import ip from "ip";
import { HttpStatusCode } from "./enums/HttpStatusCode";
import { ApiResponse } from "./helpers/ApiResponse";
import { HttpStatus } from "./enums/HttpStatus";
import userRoutes from "./routes/userRoutes";

export class App{
    private readonly app: Application;
    constructor(private readonly port: (number | string) = process.env.PORT || 4000){
        this.app = express();
        this.middilewares();
        this.routes();
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.info(`Server running on: ${ip.address()}:${this.port}`)
        });
    }

    private middilewares(): void {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
    }

    private routes(): void {
        this.app.get('/', (req: Request, res: Response) => {
            res.status(HttpStatusCode.OK)
                .send(
                    new ApiResponse(
                        HttpStatusCode.OK,
                        HttpStatus.OK,
                        'Welcome to e-commerce API v1.0'
                    )
                );
        });

        this.app.use('/api/users', userRoutes);

        this.app.all(/(.*)/, (req: Request, res: Response) => {
            res.status(HttpStatusCode.NOT_FOUND)
                .send(
                    new ApiResponse(
                        HttpStatusCode.NOT_FOUND,
                        HttpStatus.NOT_FOUND,
                        'Route does\'t exist on the server.' 
                    )
                );
        });
    }
}