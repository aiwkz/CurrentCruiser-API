import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorHandler from '../../../middlewares/errorHandlerMiddleware.js';

describe('errorHandlerMiddleware', () => {
  const mockReq = {};
  const mockRes = {
    status: vi.fn(() => mockRes),
    json: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should send custom error message and status if present', () => {
    const error = new Error('Custom error');
    error.status = 418;

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    errorHandler(error, mockReq, mockRes);

    expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
    expect(mockRes.status).toHaveBeenCalledWith(418);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Custom error',
      status: 'error',
    });
    consoleSpy.mockRestore();
  });

  it('should fallback to 500 and generic message if not provided', () => {
    const error = {};

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
    errorHandler(error, mockReq, mockRes);

    expect(consoleSpy).toHaveBeenCalledWith('Error:', error);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      status: 'error',
    });
    consoleSpy.mockRestore();
  });
});
