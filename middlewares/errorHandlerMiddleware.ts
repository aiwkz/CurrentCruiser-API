import type { ErrorRequestHandler } from 'express';
import { AppError } from '@utils/appError.ts';

const errorHandler: ErrorRequestHandler = (error, req, res): void => {
  const statusCode = (error as AppError).statusCode || 500;
  const isOperational = (error as AppError).isOperational ?? false;

  if (!isOperational) {
    console.error('💥 UNHANDLED ERROR:', error);
  }

  res.status(statusCode).json({
    status: 'error',
    message: error.message || 'Something went wrong',
  });
};

export default errorHandler;
