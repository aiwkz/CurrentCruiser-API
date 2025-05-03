import express, { type Application } from 'express';
import serverlessExpress from './utils/serverlessExpress.ts';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import logger from './utils/logger.ts';

import connectDB from './config/database.ts';

import errorLogger from './middlewares/errorLoggerMiddleware.ts';
import errorHandler from './middlewares/errorHandlerMiddleware.ts';

import authRoutes from './routes/authRoutes.ts';
import carRoutes from './routes/carRoutes.ts';
import listRoutes from './routes/listRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import categoriesRoutes from './routes/categoryRoutes.ts';

dotenv.config();

const PORT: string = process.env.PORT || '3000';
const isTest: boolean = process.env.NODE_ENV === 'test';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

const allowedOrigins = [
  'http://localhost:5173',
  'https://currentcruiser.com',
  'https://opcdphe5pov7inoqdet35jw4cy0gjksm.lambda-url.us-east-1.on.aws'
];

app.use(cors({
  origin: isTest
    ? true
    : (origin, callback) => {
      if (origin && allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'));
      }
    },
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
      logger.info(`Server running on port ${PORT}`);
    });
  });
}

export const handler = serverlessExpress({ app }); // Export handler for serverless
export { app }; // 👈 for testing
