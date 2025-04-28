import { z } from 'zod';

import { objectIdValidation } from '../validators/common.ts';

export const createCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is a required field' }),
});

export const updateCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is a required field' }),
});

export const categoryIdParamValidationSchema = z.object({
  id: objectIdValidation,
});

export type CreateCategoryInput = z.infer<typeof createCategoryValidationSchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategoryValidationSchema>;
export type CategoryIdParamInput = z.infer<typeof categoryIdParamValidationSchema>;
