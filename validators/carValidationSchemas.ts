import { z } from 'zod';

import { objectIdValidation } from '../validators/common.ts';

const specificationsSchema = z.object({
  motor: z.string().min(1, { message: 'Motor is required' }),
  horsepower: z.string().min(1, { message: 'Horsepower is required' }),
  mph0to60: z.string().min(1, { message: '0-60 mph time is required' }),
  topSpeed: z.string().min(1, { message: 'Top speed is required' }),
});

export const createCarValidationSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  history: z.string().min(1, { message: 'History is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  specifications: specificationsSchema,
  category_id: z.string().min(1, { message: 'Category ID is required' }),
  available_in_market: z.boolean(),
});

export const updateCarValidationSchema = z.object({
  name: z.string().min(1).optional(),
  history: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  specifications: specificationsSchema.partial().optional(),
  category_id: z.string().min(1).optional(),
  available_in_market: z.boolean().optional(),
}).refine(
  (data) =>
    data.name !== undefined ||
    data.history !== undefined ||
    data.description !== undefined ||
    data.specifications !== undefined ||
    data.category_id !== undefined ||
    data.available_in_market !== undefined,
  { message: 'At least one field must be provided for update' }
);

export const carIdParamValidationSchema = z.object({
  id: objectIdValidation
});

export type CreateCarInput = z.infer<typeof createCarValidationSchema>;
export type UpdateCarInput = z.infer<typeof updateCarValidationSchema>;
export type CarIdParamInput = z.infer<typeof carIdParamValidationSchema>;
