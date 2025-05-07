import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { UserInterface } from "../types";
import { User } from "../models/User";
import { PaginationResult } from "../types";

//@desc     Get users' list
//@route    GET api/users
//@access   Private
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

        res.status(HttpStatusCode.OK)
            .json(
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
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
            .json(
                new ApiResponse(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    'Failed to fetch users'
                )
            );
    }
};

//@desc     Add new user
//@route    POST api/users
//@access   Private
export const store = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { avatar, name, email, gender, password } = req.body;
    const userExists = await User.findByEmail(email);
    if (userExists) {
        res.status(HttpStatusCode.BAD_REQUEST)
            .json(
                new ApiResponse(
                    HttpStatusCode.BAD_REQUEST,
                    HttpStatus.BAD_REQUEST,
                    'User already exists'
                )
            );
    }
    
    const user = await User.create({
        name,
        email,
        gender,
        password
    })

    res.status(HttpStatusCode.CREATED)
        .json(
            new ApiResponse(
                HttpStatusCode.CREATED,
                HttpStatus.CREATED,
                'User created successfully',
                'user',
                user
            )
        );
})

//@desc     Get single user
//@route    GET api/users/id
//@access   Private
export const show = (req: Request, res: Response) => {
    
}

export const update = (req: Request, res: Response) => {
    
}

export const destroy = (req: Request, res: Response) => {
    
}