import { Router } from 'express';

import { isAdmin, isAdminOrSelf } from '@middlewares/validationMiddleware.ts';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '@controllers/userController.ts';

const router = Router();

router.get('/all', isAdmin, getAllUsers);
router.get('/:id', isAdminOrSelf, getUserById);
router.put('/:id', isAdminOrSelf, updateUser);
router.delete('/:id', isAdminOrSelf, deleteUser);

export default router;
