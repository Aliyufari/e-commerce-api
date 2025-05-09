import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import { RoleInterface } from "../types";
import { Role } from "../models/Role";
import { ApiResponse } from "../helpers/ApiResponse";
import { HttpStatusCode } from "../enums/HttpStatusCode";
import { HttpStatus } from "../enums/HttpStatus";


//@desc     Get roles' list
//@route    GET api/roles
//@access   Private
export const index = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const roles: RoleInterface[] = await Role.find().populate('permissions', 'names');

    res.json(
        new ApiResponse(
            HttpStatusCode.OK,
            HttpStatus.OK,
            'Roles retrieved successfully',
            'roles',
            roles
        )
    );
});