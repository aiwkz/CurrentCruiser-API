import { Router } from 'express';

import { isAdmin } from '@middlewares/validationMiddleware.ts';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '@controllers/categoryController.ts';

const router = Router();

router.post('/create', createCategory);
router.get('/all', isAdmin, getAllCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
