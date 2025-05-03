import { Request, Response } from "express";
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { UserInterface } from "../interfaces/UserInterface";
import { User } from "../models/User";
import { PaginationResult } from "../interfaces/PaginationResult";

let users = [
    {id: 1, name: 'John Doe', email: 'jdoe@email.com', password: '', gender: 'Male'},
    {id: 2, name: 'John Smith', email: 'jsmith@email.com', password: '', gender: 'Male'},
    {id: 3, name: 'Jane Doe', email: 'jane@email.com', password: '', gender: 'Female'}
];

export const index = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const sortField = (req.query.sort as string) || 'createdAt';
        const sortOrder = req.query.order === 'asc' ? 1 : -1;

        const sort: Record<string, number> = {};
        sort[sortField] = sortOrder;

        const filter: Record<string, any> = {};
        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }

        if (req.query.gender) {
            filter.gender = req.query.gender;
        }

        const options = {
            page,
            limit,
            sort,
            select: '-password',
            lean: true
        };

        const result: PaginationResult<UserInterface> = await User.paginate(filter, options);

        res.status(HttpStatusCode.OK).json(
            new ApiResponse(
                HttpStatusCode.OK,
                HttpStatus.OK,
                'Users fetched successfully',
                'data',
                {
                    users: result.docs,
                    links: {
                        total: result.totalDocs,
                        page: result.page,
                        pages: result.totalPages,
                        limit: result.limit,
                        hasNextPage: result.hasNextPage,
                        hasPrevPage: result.hasPrevPage,
                        nextPage: result.nextPage,
                        prevPage: result.prevPage
                    }
                }
            )
        );
    } catch (error) {
        console.error('Pagination error:', error);
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(
            new ApiResponse(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Failed to fetch users'
            )
        );
    }
};

export const store = (req: Request, res: Response) => {
    
}

export const show = (req: Request, res: Response) => {
    
}

export const update = (req: Request, res: Response) => {
    
}

export const destroy = (req: Request, res: Response) => {
    
}