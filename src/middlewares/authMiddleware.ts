import { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { ApiResponse } from '../helpers/ApiResponse';
import { HttpStatus } from '../enums/HttpStatus';
import { AuthRequest, RoleInterface } from '../types';

// Middleware to protect routes (authentication)
export const protect = asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                res.status(HttpStatusCode.NOT_FOUND)
                    .json(
                        new ApiResponse(
                            HttpStatusCode.NOT_FOUND, 
                            HttpStatus.NOT_FOUND, 
                            'User not found'
                        )
                    );
                return;
            }

            req.user = user;
            next();

        } catch (error: unknown) {
            console.error(error);
            
            res.status(HttpStatusCode.FORBIDDEN)
                .json(
                    new ApiResponse(
                        HttpStatusCode.FORBIDDEN, 
                        HttpStatus.FORBIDDEN, 
                        'Unauthorized'
                    )
                );
        }
    } else {
        res.status(HttpStatusCode.FORBIDDEN)
            .json(
                new ApiResponse(
                    HttpStatusCode.FORBIDDEN, 
                    HttpStatus.FORBIDDEN, 
                    'No token provided'
                )
            );
    }
});

// Middleware to authorize by role
export const hasRole = (...roles: string[]) => [
    protect,
    asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findById(req.user?.id).populate('role');

        if (!user || !roles.includes((user.role as RoleInterface).name)) {
            res.status(HttpStatusCode.FORBIDDEN)
                .json(
                    new ApiResponse(
                        HttpStatusCode.FORBIDDEN, 
                        HttpStatus.FORBIDDEN, 
                        'Forbidden: Role not allowed'
                    )
                );
        }

        next();
    }),
];

// Middleware to authorize by permission
export const hasPermission = (permissions: string | string[]) => [
    protect,
    asyncHandler(async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        const user = await User.findById(req.user?.id).populate({
            path: 'role',
            populate: { path: 'permissions' }
        });

        if (!user) {
            res.status(HttpStatusCode.UNAUTHORIZED)
                .json(
                    new ApiResponse(
                        HttpStatusCode.UNAUTHORIZED, 
                        HttpStatus.UNAUTHORIZED, 
                        'User not found'
                    )
                );
        }

        const userPermissions = (user?.role as RoleInterface).permissions.map((p: any) => p.name);
        const required = Array.isArray(permissions) ? permissions : [permissions];

        const hasRequired = required.every(p => userPermissions.includes(p));
        if (!hasRequired) {
            res.status(HttpStatusCode.FORBIDDEN)
                .json(
                    new ApiResponse(
                        HttpStatusCode.FORBIDDEN, 
                        HttpStatus.FORBIDDEN, 
                        'Forbidden: Permission denied'
                    )
                );
        }

        next();
    }),
];
