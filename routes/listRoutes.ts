import { Router } from 'express';

import { isAdmin } from '@middlewares/validationMiddleware.ts';
import {
  createList,
  getAllLists,
  getListById,
  getListsByUserId,
  updateList,
  deleteList,
} from '@controllers/listController.ts';

const router = Router();

router.post('/create', createList);
router.get('/all', isAdmin, getAllLists);
router.get('/:id', getListById);
router.get('/user/:userId', getListsByUserId);
router.put('/:id', updateList);
router.delete('/:id', deleteList);

export default router;
