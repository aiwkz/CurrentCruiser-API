import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

import logger from '../utils/logger.ts';
import { AppError } from '../utils/appError.ts';

const validateSchema = (
  schema: ZodSchema,
  property: 'body' | 'params' | 'query' = 'body'
) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req[property]);

  if (!result.success) {
    const formatted = result.error.format();
    logger.error('Validation error:', formatted);
    return next(new AppError('Validation failed', 400, true));
  }

  if (property === 'body') {
    req.body = result.data;
  }
  next();
};

export default validateSchema;
