import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import carRoutes from './routes/carRoutes.js';
import listRoutes from './routes/listRoutes.js';
import userRoutes from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();
console.clear();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Auth routes
app.use('/api/auth', authRoutes);

// Car routes
app.use('/api/cars', carRoutes);

// List routes
app.use('/api/lists', listRoutes);

// User routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

