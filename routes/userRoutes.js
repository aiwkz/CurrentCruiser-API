import { Router } from 'express';

import { isAdmin, isAdminOrSelf } from '../middlewares/validationMiddleware.js';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = Router();

// Route: GET /api/users/all
// Description: Get all users
router.get('/all', isAdmin, getAllUsers);

// Route: GET /api/users/:id
// Description: Get user by id
router.get('/:id', isAdminOrSelf, getUserById);

// Route: PUT /api/users/:id
// Description: Update user by id
router.put('/:id', isAdminOrSelf, updateUser);

// Route: DELETE /api/users/:id
// Description: Delete user by id
router.delete('/:id', isAdminOrSelf, deleteUser);

export default router;
