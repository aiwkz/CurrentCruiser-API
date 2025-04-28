import { z } from 'zod';
import { objectIdValidation } from '../validators/common.ts';

export const createListValidationSchema = z.object({
  user_id: objectIdValidation,
  title: z.string().min(1, { message: 'Title is a required field' }),
  cars: z.array(z.string()).default([]),
});

export const updateListValidationSchema = z.object({
  user_id: objectIdValidation.optional(),
  title: z.string().min(1, { message: 'Title is a required field' }).optional(),
  cars: z.array(z.string()).optional(),
}).refine(
  (data) => data.user_id !== undefined || data.title !== undefined || data.cars !== undefined,
  { message: 'At least one of user_id, title, or cars is required' }
);

export const listIdParamValidationSchema = z.object({
  id: objectIdValidation,
});

export const userIdParamValidationSchema = z.object({
  userId: objectIdValidation,
});

export type CreateListInput = z.infer<typeof createListValidationSchema>;
export type UpdateListInput = z.infer<typeof updateListValidationSchema>;
export type ListIdParamInput = z.infer<typeof listIdParamValidationSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamValidationSchema>;
