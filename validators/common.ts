import { z } from 'zod';

export const objectIdValidation = z.string().length(24, { message: 'Invalid ID' });
