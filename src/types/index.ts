import { Request } from 'express';
import mongoose, { Document, PaginateModel } from 'mongoose';

// User
export interface UserInterface extends Document {
  avatar?: string;
  name: string;
  email: string;
  phone: number;
  password: string;
  gender?: 'Male' | 'Female';
  role: mongoose.Types.ObjectId | RoleInterface;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(path: string): boolean;
}

export interface UserModel<T extends Document> extends PaginateModel<T> {
  findByEmail(email: string): Promise<T | null>;
}

// Roles & Permissions
export interface RoleInterface extends Document {
  name: string; 
  permissions: mongoose.Types.ObjectId[] | PermissionInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PermissionInterface extends Document {
  name: string; 
}

// Auth Request
export interface AuthRequest extends Request {
  user?: UserInterface;
}

// Pagination
export interface PaginationResult<T> {
    docs: T[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page?: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage?: number | null;
    nextPage?: number | null;
}

