import { Router } from 'express';

import validateSchema from '@validators/validateSchema.ts';
import { registerValidationSchema, loginValidationSchema } from '@validators/authValidationSchemas.ts';
import { loginUser, registerUser } from '@controllers/authController.ts';

const router = Router();

router.post('/register', validateSchema(registerValidationSchema), registerUser);
router.post('/login', validateSchema(loginValidationSchema), loginUser);

export default router;
