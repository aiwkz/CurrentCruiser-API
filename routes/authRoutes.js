import { Router } from 'express';

import { loginUser, registerUser } from '../controllers/authController.js';

const router = Router();

// Route: POST /api/auth/register
// Description: Register a new user
router.post('/register', registerUser);

// Route: POST /api/auth/login
// Description: User login
router.post('/login', loginUser);

export default router;
