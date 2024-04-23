import { Router } from 'express';

import { isAdmin } from '../middlewares/validationMiddleware.js';
import {
  createList,
  getAllLists,
  getListById,
  getListsByUserId,
  updateList,
  deleteList
} from '../controllers/listController.js';

const router = Router();

// Route: POST /api/lists/create
// Description: Create a new list
router.post('/create', createList);

// Route: GET /api/lists/all
// Description: Get all lists
router.get('/all', isAdmin, getAllLists);

// Route: GET /api/lists/:id
// Description: Get a list by ID
router.get('/:id', getListById);

// Route: GET /api/lists/user/:userId
// Description: Get a list by ID
router.get('/user/:userId', getListsByUserId);

// Route: PUT /api/lists/:id
// Description: Update a list by ID
router.put('/:id', updateList);

// Route: DELETE /api/lists/:id
// Description: Delete a list by ID
router.delete('/:id', deleteList);

export default router;
