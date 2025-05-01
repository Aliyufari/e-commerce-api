import { Request, Response } from "express";
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";

let users = [
    {id: 1, name: 'John Doe', email: 'jdoe@email.com', password: '', gender: 'Male'},
    {id: 2, name: 'John Smith', email: 'jsmith@email.com', password: '', gender: 'Male'},
    {id: 3, name: 'Jane Doe', email: 'jane@email.com', password: '', gender: 'Female'}
];

export const index = (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK)
        .send(
            new ApiResponse(
                HttpStatusCode.OK,
                HttpStatus.OK,
                'Users fetched successfully.',
                users
            )
        );
}

export const store = (req: Request, res: Response) => {
    
}

export const show = (req: Request, res: Response) => {
    
}

export const update = (req: Request, res: Response) => {
    
}

export const destroy = (req: Request, res: Response) => {
    
}