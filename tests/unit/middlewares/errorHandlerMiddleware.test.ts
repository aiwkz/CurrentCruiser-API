import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { Request, Response, NextFunction } from 'express';

import errorHandler from '../../../middlewares/errorHandlerMiddleware.ts'
import logger from '../../../utils/logger.ts';

describe('errorHandlerMiddleware', () => {
  const mockReq = {} as Request;

  const mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  } as unknown as Response;

  const mockNext: NextFunction = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send custom error message and status if present', async () => {
    const error = new Error('Custom error') as Error & { status?: number };
    error.status = 418;

    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger);

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(loggerSpy).toHaveBeenCalledWith('💥 UNHANDLED ERROR:', error);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Custom error',
      status: 'error',
    });

    loggerSpy.mockRestore();
  });

  it('should fallback to 500 and generic message if not provided', async () => {
    const error = {} as Error;

    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger);

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(loggerSpy).toHaveBeenCalledWith('💥 UNHANDLED ERROR:', error);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
      status: 'error',
    });

    loggerSpy.mockRestore();
  });

  it('should not call next when responding to error', async () => {
    const error = new Error('Something went wrong');

    const loggerSpy = vi.spyOn(logger, 'error').mockImplementation(() => logger);

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();

    loggerSpy.mockRestore();
  });
});
