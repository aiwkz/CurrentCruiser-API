import { Router } from 'express';

import { isAdmin } from '../middlewares/validationMiddleware.ts';
import validateSchema from '../validators/validateSchema.ts';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} from '../controllers/carController.ts';
import {
  carIdParamValidationSchema,
  createCarValidationSchema,
  updateCarValidationSchema
} from '../validators/carValidationSchemas.ts';

const router = Router();

router.post('/create', isAdmin, validateSchema(createCarValidationSchema), createCar);
router.get('/all', getAllCars);
router.get('/:id', validateSchema(carIdParamValidationSchema, 'params'), getCarById);
router.put(
  '/:id',
  isAdmin,
  validateSchema(carIdParamValidationSchema, 'params'),
  validateSchema(updateCarValidationSchema, 'body'),
  updateCar
);
router.delete('/:id', isAdmin, validateSchema(carIdParamValidationSchema, 'params'), deleteCar);

export default router;
