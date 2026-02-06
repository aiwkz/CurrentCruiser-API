import { Router } from 'express';

import { isAdmin } from '../middlewares/validationMiddleware.ts';
import validateSchema from '../validators/validateSchema.ts';
import {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
  categoryIdParamValidationSchema
} from '../validators/categoryValidationSchemas.ts';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.ts';

const router = Router();

router.post('/create', isAdmin, validateSchema(createCategoryValidationSchema), createCategory);
router.get('/all', isAdmin, getAllCategories);
router.get('/:id', validateSchema(categoryIdParamValidationSchema, 'params'), getCategoryById);
router.put(
  '/:id',
  isAdmin,
  validateSchema(categoryIdParamValidationSchema, 'params'),
  validateSchema(updateCategoryValidationSchema, 'body'),
  updateCategory
);
router.delete('/:id', isAdmin, validateSchema(categoryIdParamValidationSchema, 'params'), deleteCategory);

export default router;
