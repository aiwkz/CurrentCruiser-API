import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error, req, res) => {
  console.error('Error:', error);

  res.status(error.status || 500).json({
    message: error.message || 'Internal Server Error',
    status: 'error',
  });
};

export default errorHandler;
