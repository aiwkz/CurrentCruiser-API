import { describe, it, expect, vi, beforeEach } from 'vitest';
import errorLogger from '../../../middlewares/errorLoggerMiddleware.js';
import ErrorLog from '../../../models/ErrorLog.js';
import getUserFromJWT from '../../../utils/validation.js';

vi.mock('../../../models/ErrorLog.js', () => ({
  default: {
    create: vi.fn()
  }
}));

vi.mock('../../../utils/validation.js', () => ({
  default: vi.fn()
}));

describe('errorLoggerMiddleware', () => {
  const mockNext = vi.fn();
  const error = new Error('Test error');
  const mockReq = {
    originalUrl: '/api/test/route',
    headers: {
      authorization: 'Bearer fake.token'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should log the error and call next(error)', async () => {
    getUserFromJWT.mockReturnValue({ id: 'user123', role: 'admin' });

    await errorLogger(error, mockReq, {}, mockNext);

    expect(getUserFromJWT).toHaveBeenCalledWith('fake.token');
    expect(ErrorLog.create).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Test error',
      route: '/api/test/route',
      user: { id: 'user123', role: 'admin' }
    }));
    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it('should handle logging failure gracefully and still call next(error)', async () => {
    getUserFromJWT.mockReturnValue(null);
    ErrorLog.create.mockImplementation(() => { throw new Error('DB fail'); });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    await errorLogger(error, mockReq, {}, mockNext);

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error logging failed:'), expect.any(Error));
    expect(mockNext).toHaveBeenCalledWith(error);

    consoleSpy.mockRestore();
  });
});
