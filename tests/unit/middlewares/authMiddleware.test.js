import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { createJwtToken, verifyToken } from '../../../middlewares/authMiddleware.js';

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn()
  }
}));

describe('authMiddleware', () => {
  const mockUser = { _id: 'abc123', role: 'admin' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createJwtToken', () => {
    it('should create a token with user payload', () => {
      jwt.sign.mockReturnValue('mocked-token');
      const token = createJwtToken(mockUser);
      expect(token).toBe('mocked-token');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: mockUser._id, role: mockUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    });
  });

  describe('verifyToken', () => {
    const mockReq = {
      header: vi.fn(),
    };
    const mockRes = {
      status: vi.fn(() => mockRes),
      json: vi.fn()
    };
    const mockNext = vi.fn();

    it('should return 401 if no token is found', () => {
      mockReq.header.mockReturnValue('');
      verifyToken(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'No token found' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 for invalid token', () => {
      mockReq.header.mockReturnValue('Bearer invalid.token');
      jwt.verify.mockImplementation(() => { throw new Error('bad token') });

      verifyToken(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Invalid token' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next and set req.user for valid token', () => {
      mockReq.header.mockReturnValue('Bearer valid.token');
      const payload = { userId: 'abc123', role: 'admin' };
      jwt.verify.mockReturnValue(payload);

      verifyToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(payload);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
