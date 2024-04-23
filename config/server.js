import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database.js';

import authRoutes from '../routes/authRoutes.js';
import carRoutes from '../routes/carRoutes.js';
// import listRoutes from '../routes/listRoutes.js';
import userRoutes from '../routes/userRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Get PORT number from env file or set 8080 if there is no value
const PORT = process.env.PORT || 8080;

// Initialize Express app
const app = express();
console.clear();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to the database
connectDB();

// Route setup
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
// app.use('/api/lists', listRoutes);
app.use('/api/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
