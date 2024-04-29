import { Router } from 'express';

import { isAdmin } from '../middlewares/validationMiddleware.js';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = Router();

// Route: POST /api/categories/create
// Description: Create a new category
router.post('/create', createCategory);

// Route: GET /api/categories/all
// Description: Get all categories
router.get('/all', isAdmin, getAllCategories);

// Route: GET /api/categories/:id
// Description: Get a category by ID
router.get('/:id', getCategoryById);

// Route: PUT /api/categories/:id
// Description: Update a category by ID
router.put('/:id', updateCategory);

// Route: DELETE /api/categories/:id
// Description: Delete a category by ID
router.delete('/:id', deleteCategory);

export default router;
