import { Router } from 'express';
import { isAdmin, isAdminOrSelf } from '../middlewares/validationMiddleware.ts';
import validateSchema from '../validators/validateSchema.ts';
import {
  createUserValidationSchema,
  updateUserValidationSchema,
  userIdParamValidationSchema
} from '../validators/userValidationSchemas.ts';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.ts';

const router = Router();

router.post('/create', isAdmin, validateSchema(createUserValidationSchema), createUser);
router.get('/all', isAdmin, getAllUsers);
router.get('/:id', isAdminOrSelf, validateSchema(userIdParamValidationSchema, 'params'), getUserById);
router.put(
  '/:id',
  isAdminOrSelf,
  validateSchema(userIdParamValidationSchema, 'params'),
  validateSchema(updateUserValidationSchema, 'body'),
  updateUser
);
router.delete('/:id', isAdminOrSelf, validateSchema(userIdParamValidationSchema, 'params'), deleteUser);

export default router;
