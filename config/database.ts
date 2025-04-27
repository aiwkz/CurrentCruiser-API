import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { AppError } from '@utils/appError.ts';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new AppError('❌ MONGODB_URI is not defined in environment variables', 500, false);
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('❌ MongoDB connection failed:', message);
  }
};

export default connectDB;
