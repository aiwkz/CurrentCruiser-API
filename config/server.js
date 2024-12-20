import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import errorLogger from '../middlewares/errorLoggerMiddleware.js';
import errorHandler from '../middlewares/errorHandlerMiddleware.js';

import authRoutes from '../routes/authRoutes.js';
import carRoutes from '../routes/carRoutes.js';
import listRoutes from '../routes/listRoutes.js';
import userRoutes from '../routes/userRoutes.js';
import categoriesRoutes from '../routes/categoryRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// Get PORT number from env file or set 8080 if there is no value
const PORT = process.env.PORT || 8080;

// Initialize Express app
const app = express();
console.clear();

// Middleware setup
app.use(cors({
  origin: ['http://localhost:5173', 'https://currentcruiser-api.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorLogger);
app.use(errorHandler);

// Connect to the database
connectDB();

// Route setup
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
