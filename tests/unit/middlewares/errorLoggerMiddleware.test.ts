import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

import errorLogger from '@middlewares/errorLoggerMiddleware.ts';
import ErrorLog from '@models/ErrorLog.ts';
import { createJwtToken } from '@middlewares/authMiddleware.ts';
import { AppError } from '@utils/appError.ts';

describe('errorLoggerMiddleware', () => {
  const error = new Error('Test error');
  const mockNext: NextFunction = vi.fn();

  const mockRes = {} as Response;

  const token = createJwtToken({
    _id: 'user123',
    role: 'admin',
  });

  const mockReq = {
    originalUrl: '/api/test/route',
    headers: {
      authorization: `Bearer ${token}`,
    },
  } as Request;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log the error and call next(error)', async () => {
    const logSpy = vi
      .spyOn(ErrorLog, 'create')
      .mockResolvedValue({
        message: 'Test error',
        timestamp: new Date().toISOString(),
        route: '/api/test/route',
        user: JSON.stringify({ id: 'user123', role: 'admin' }),
      } as unknown as Awaited<ReturnType<typeof ErrorLog.create>>);

    await errorLogger(error, mockReq, mockRes, mockNext);

    expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Test error',
      route: '/api/test/route',
      user: expect.any(String),
    }));

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle logging failure gracefully and still call next(error)', async () => {
    vi.spyOn(ErrorLog, 'create').mockImplementationOnce(() => {
      throw new AppError('DB fail', 500, true);
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    await errorLogger(error, mockReq, mockRes, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error logging failed:'),
      expect.any(Error)
    );

    expect(mockNext).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
