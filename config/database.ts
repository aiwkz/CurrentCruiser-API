import mongoose from 'mongoose';
import dotenv from 'dotenv';

import logger from '../utils/logger.ts';
import { AppError } from '../utils/appError.ts';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new AppError('❌ MONGODB_URI is not defined in environment variables', 500, false);
}

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('✅ MongoDB connected successfully');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('❌ MongoDB connection failed:', message);
  }
};

export default connectDB;
