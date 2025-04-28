import { z } from 'zod';

import { objectIdValidation } from '../validators/common.ts';

export const createUserValidationSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  role: z.string().min(1, { message: 'Role is required' }),
});

export const updateUserValidationSchema = z
  .object({
    username: z.string().min(1).optional(),
    email: z.string().email().optional(),
    password: z.string().min(1).optional(),
    role: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      data.username !== undefined ||
      data.email !== undefined ||
      data.password !== undefined ||
      data.role !== undefined,
    {
      message: 'At least one of username, email, password, or role is required',
    }
  );

export const userIdParamValidationSchema = z.object({
  id: objectIdValidation
});

export type CreateUserInput = z.infer<typeof createUserValidationSchema>;
export type UpdateUserInput = z.infer<typeof updateUserValidationSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamValidationSchema>;
