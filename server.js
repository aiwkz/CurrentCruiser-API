import express from 'express';
import serverlessExpress from '@vendia/serverless-express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import errorLogger from './middlewares/errorLoggerMiddleware.js';
import errorHandler from './middlewares/errorHandlerMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import listRoutes from './routes/listRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoriesRoutes from './routes/categoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Get PORT number from env file or set 3000 if there is no value
const PORT = process.env.PORT || 3000;

const isProduction = process.env.NODE_ENV === 'production';
const isLocal = process.env.IS_LOCAL === 'true';
const isTest = process.env.NODE_ENV === 'test';

// Initialize Express app
const app = express();
console.clear();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://currentcruiser-api.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorLogger);
app.use(errorHandler);

// Connect to the database
if (!isTest) {
  connectDB();
}

// Route setup
app.use('/api', limiter);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/assets/images', express.static(join(__dirname, '../assets/images')));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to Current Cruiser API');
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Local development server (only when running locally)
if (isLocal && !isTest && !process.env.SKIP_DB) {
  app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
  });
}

// Export the Lambda handler
export const handler = serverlessExpress({ app }).handler;
export { app }; // 👈 for testing
