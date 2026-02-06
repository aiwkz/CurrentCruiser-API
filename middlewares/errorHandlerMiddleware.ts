import type { ErrorRequestHandler } from 'express';

import { AppError } from '../utils/appError.ts';
import logger from '../utils/logger.ts';

const errorHandler: ErrorRequestHandler = (error, _req, res): void => {
  const statusCode = (error as AppError).statusCode || 500;
  const isOperational = (error as AppError).isOperational ?? false;

  if (!isOperational) {
    logger.error('💥 UNHANDLED ERROR:', error);
  }

  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Something went wrong',
  });
};

export default errorHandler;
