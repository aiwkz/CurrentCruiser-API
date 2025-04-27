import express, { type Application } from 'express';
import serverlessExpress from './utils/serverlessExpress.ts';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from '@config/database.ts';

import errorLogger from '@middlewares/errorLoggerMiddleware.ts';
import errorHandler from '@middlewares/errorHandlerMiddleware.ts';

import authRoutes from '@routes/authRoutes.ts';
import carRoutes from '@routes/carRoutes.ts';
import listRoutes from '@routes/listRoutes.ts';
import userRoutes from '@routes/userRoutes.ts';
import categoriesRoutes from '@routes/categoryRoutes.ts';

dotenv.config();

const PORT: string = process.env.PORT || '3000';
const isTest: boolean = process.env.NODE_ENV === 'test';

const app: Application = express();
console.clear();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(cors({
  origin: ['http://localhost:5173', 'https://currentcruiser.com'],
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);

app.use(errorLogger);
app.use(errorHandler);

if (!isTest) {
  await connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });
}

export const handler = serverlessExpress({ app }); // Export handler for serverless
export { app }; // 👈 for testing
