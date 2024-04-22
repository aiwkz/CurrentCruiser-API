import { Router } from 'express';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/userController.js';

const router = Router();

// Route: GET /api/users/all
// Description: Get all users
router.get('/all', getAllUsers);

// Route: GET /api/users/:id
// Description: Get user by id
router.get('/:id', getUserById);

// Route: PUT /api/users/:id
// Description: Update user by id
router.put('/:id', updateUser);

// Route: DELETE /api/users/:id
// Description: Delete user by id
router.delete('/:id', deleteUser);

export default router;
