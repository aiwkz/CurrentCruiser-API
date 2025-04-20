import { Router } from 'express';

import { isAdmin } from '@middlewares/validationMiddleware.ts';
import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar,
} from '@controllers/carController.ts';

const router = Router();

router.post('/create', isAdmin, createCar);
router.get('/all', getAllCars);
router.get('/:id', getCarById);
router.put('/:id', isAdmin, updateCar);
router.delete('/:id', isAdmin, deleteCar);

export default router;
