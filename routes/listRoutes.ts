import { Router } from 'express';

import { isAdmin } from '@middlewares/validationMiddleware.ts';
import validateSchema from '@validators/validateSchema.ts';
import {
  createListValidationSchema,
  updateListValidationSchema,
  listIdParamValidationSchema,
  userIdParamValidationSchema
} from '@validators/listValidationSchemas.ts';
import {
  createList,
  getAllLists,
  getListById,
  getListsByUserId,
  updateList,
  deleteList,
} from '@controllers/listController.ts';

const router = Router();

router.post('/create', validateSchema(createListValidationSchema), createList);
router.get('/all', isAdmin, getAllLists);
router.get('/:id', validateSchema(listIdParamValidationSchema, 'params'), getListById);
router.get('/user/:userId', validateSchema(userIdParamValidationSchema, 'params'), getListsByUserId);
router.put(
  '/:id',
  validateSchema(listIdParamValidationSchema, 'params'),
  validateSchema(updateListValidationSchema, 'body'),
  updateList
);
router.delete('/:id', validateSchema(listIdParamValidationSchema, 'params'), deleteList);

export default router;
