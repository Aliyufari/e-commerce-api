import { Document } from 'mongoose';

export interface UserInterface extends Document{
    id: number;
    name: string;
    email: string;
    password?: string;
    gender: 'Male' | 'Female';
    createdAt: Date;
    updatedAt: Date;
}