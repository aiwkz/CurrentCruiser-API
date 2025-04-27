import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '@middlewares/errorHandlerMiddleware.ts';
import type { Request, Response, NextFunction } from 'express';

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

    const consoleSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(console, 'error').mockImplementation(() => { });

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith('💥 UNHANDLED ERROR:', error);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Custom error',
      status: 'error',
    });

    consoleSpy.mockRestore();
  });

  it('should fallback to 500 and generic message if not provided', async () => {
    const error = {} as Error;

    const consoleSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(console, 'error').mockImplementation(() => { });

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith('💥 UNHANDLED ERROR:', error);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Something went wrong',
      status: 'error',
    });

    consoleSpy.mockRestore();
  });

  it('should not call next when responding to error', async () => {
    const error = new Error('Something went wrong');

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    await errorHandler(error, mockReq, mockRes, mockNext);

    expect(mockNext).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
