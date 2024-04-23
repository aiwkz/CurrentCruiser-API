import { Router } from 'express';

import {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  deleteCar
} from '../controllers/carController.js';

const router = Router();

// Route: POST /api/cars/create
// Description: Create a new car
router.post('/create', createCar);

// Route: GET /api/cars
// Description: Get all cars
router.get('/all', getAllCars);

// Route: GET /api/cars/:id
// Description: Get a car by ID
router.get('/:id', getCarById);

// Route: PUT /api/cars/:id
// Description: Update a car by ID
router.put('/:id', updateCar);

// Route: DELETE /api/cars/:id
// Description: Delete a car by ID
router.delete('/:id', deleteCar);

export default router;
