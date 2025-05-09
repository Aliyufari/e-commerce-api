import { Request, Response } from "express";
import asyncHandler from 'express-async-handler';
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatus } from "../enums/HttpStatus";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { UserInterface } from "../types";
import { Role } from "../models/Role";
import { User } from "../models/User";
import { PaginationResult } from "../types";

//@desc     Get users' list
//@route    GET api/users
//@access   Private
export const index = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

    const result: PaginationResult<UserInterface> = await User.paginate(filter, {
        page,
        limit,
        sort,
        select: '-password',
        populate: {
            path: 'role',
            select: 'name'
        }
    });

    res.status(HttpStatusCode.OK).json(new ApiResponse(
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
    ));
});

//@desc     Add new user
//@route    POST api/users
//@access   Private
export const store = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, gender, password, role_id } = req.body;
    const avatar = req.file ? req.file.filename : null;

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

    const phoneExists = await User.findOne({ phone: phone });
    if (phoneExists) {
        res.status(HttpStatusCode.BAD_REQUEST)
            .json(
                new ApiResponse(
                    HttpStatusCode.BAD_REQUEST,
                    HttpStatus.BAD_REQUEST,
                    'Phone already in use'
                )
            );
        
        return;
    }

    const role = await Role.findOne({ _id: role_id });
    
    const user = await User.create({
        avatar,
        name,
        email,
        phone,
        gender,
        role: role?._id,
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
export const show = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const user = await User.findById(id).populate('role', 'name');
    if (!user) {
        res.json(
            new ApiResponse(
                HttpStatusCode.NOT_FOUND,
                HttpStatus.NOT_FOUND,
                'User Not Found'
            )
        );

        return;
    }

    res.json(
        new ApiResponse(
            HttpStatusCode.OK,
            HttpStatus.OK,
            'User fetched successfully',
            'user',
            user
        )
    );
});

//@desc     Update user
//@route    PUT api/users/:id
//@access   Private
export const update = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    const { name, email, phone, gender, password, role_id } = req.body;
    const avatar = req.file ? req.file.filename : null;

    const user = await User.findById(id);
    if (!user) {
        res.json(
            new ApiResponse(
                HttpStatusCode.NOT_FOUND,
                HttpStatus.NOT_FOUND,
                'User not found'
            )
        );

        return;
    }

    const role = await Role.findById(role_id);
    if (!role) {
        res.status(HttpStatusCode.NOT_FOUND).json(new ApiResponse(
            HttpStatusCode.NOT_FOUND,
            HttpStatus.NOT_FOUND,
            'Role not found'
        ));
        return;
    }

    const updatedUser = User.findByIdAndUpdate(id, {
        avatar,
        name,
        email,
        phone,
        gender,
        role: role?._id,
        updatedAt: new Date()
    })

    res.json(
        new ApiResponse(
            HttpStatusCode.OK,
            HttpStatus.OK,
            'User updated successfully',
            'user',
            updatedUser
        )
    );
})

//@desc     Delete user
//@route    DELETE api/users/:id
//@access   Private
export const destroy = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id;

    const user = await User.findById(id);
    if (!user) {
        res.json(
            new ApiResponse(
                HttpStatusCode.NOT_FOUND,
                HttpStatus.NOT_FOUND,
                'User not found'
            )
        );

        return;
    }

    await User.findOneAndDelete({ _id: id });

    res.json(
        new ApiResponse(
            HttpStatusCode.OK,
            HttpStatus.OK,
            'User deleted successfully'
        )
    );
})