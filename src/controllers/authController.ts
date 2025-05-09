import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { ApiResponse } from '../helpers/ApiResponse';
import { HttpStatusCode } from '../enums/HttpStatusCode';
import { HttpStatus } from '../enums/HttpStatus';

//@desc     Register User
//@route    POST api/auth/register
//@access   Public
export const register =  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, gender, phone, password } = req.body;
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
        
        return;
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

    const role = await Role.findOne({ name: 'user' });
    if (!role) {
        console.error('Role not found');
        res.status(HttpStatusCode.BAD_REQUEST)
            .json(
                new ApiResponse(
                    HttpStatusCode.BAD_REQUEST,
                    HttpStatus.BAD_REQUEST,
                    'Role not found'
                )  
            );
        return;
    }
    const user = await User.create({
        avatar,
        name,
        email,
        phone,
        gender,
        role: role._id,
        password
    })

    if (user) {
        res.status(HttpStatusCode.CREATED)
            .json(
                new ApiResponse(
                    HttpStatusCode.CREATED,
                    HttpStatus.CREATED,
                    'User created successfully',
                    'user',
                    {
                        id: user.id,
                        avatar: user.avatar ? `/uploads/${user.avatar}` : null,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user.id),
                        last_login: user.lastLogin
                    }
                )
            );

        return;
    }

    res.status(HttpStatusCode.BAD_REQUEST)
        .json(
            new ApiResponse(
                HttpStatusCode.BAD_REQUEST,
                HttpStatus.BAD_REQUEST,
                'Invalid data supplied'
            )
        );
});

//@desc     Login User
//@route    POST api/auth/login
//@access   Public
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    
    const user = await User.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
        // Update last login date
        user.lastLogin = new Date(); 
        await user.save();

        res.status(HttpStatusCode.CREATED)
            .json(
                new ApiResponse(
                    HttpStatusCode.CREATED,
                    HttpStatus.CREATED,
                    'User logged in successfully',
                    'user',
                    {
                        id: user.id,
                        avatar: user.avatar ? `/uploads/${user.avatar}` : null,
                        name: user.name,
                        email: user.email,
                        token: generateToken(user.id),
                        last_login: user.lastLogin
                    }
                )
            );

        return;
    }

    res.status(HttpStatusCode.BAD_REQUEST)
        .json(
            new ApiResponse(
                HttpStatusCode.BAD_REQUEST,
                HttpStatus.BAD_REQUEST,
                'Invalid credentials'
            )
        );
}); 

export const me = asyncHandler( async (req: Request, res: Response): Promise<void> => {

});

const generateToken = (id: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT secret not set');
    }

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}