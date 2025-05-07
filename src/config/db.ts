import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<typeof mongoose> => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        return conn;
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}