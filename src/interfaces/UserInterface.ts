
import { Document, PaginateModel } from 'mongoose';

export interface UserInterface extends Document {
  name: string;
  email: string;
  password: string;
  gender: 'Male' | 'Female';
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  profilePicture?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(path: string): boolean;
}

export interface UserModel<T extends Document> extends PaginateModel<T> {
  findByEmail(email: string): Promise<T | null>;
}