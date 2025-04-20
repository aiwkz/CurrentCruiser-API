import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables');
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
