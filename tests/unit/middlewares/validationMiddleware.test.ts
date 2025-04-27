import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import jwt from 'jsonwebtoken';
import { isAdmin, isAdminOrSelf } from '@middlewares/validationMiddleware.ts';
import type { Request, Response, NextFunction } from 'express';

vi.mock('jsonwebtoken');

describe('validationMiddleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    };
    mockNext = vi.fn();
    vi.clearAllMocks();
  });

  describe('isAdmin', () => {
    it('should return 401 if no token is provided', () => {
      mockReq.header = vi.fn().mockReturnValue(undefined);

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No token, authorization denied',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      mockReq.header = vi.fn().mockReturnValue('badtoken');
      (jwt.verify as Mock).mockImplementation(() => { throw new Error('Invalid token'); });

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Invalid token',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is not admin', () => {
      mockReq.header = vi.fn().mockReturnValue('goodtoken');
      (jwt.verify as Mock).mockReturnValue({ _id: '123', role: 'user' });

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Access forbidden. Admin role required.',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      mockReq.header = vi.fn().mockReturnValue('goodtoken');
      (jwt.verify as Mock).mockReturnValue({ _id: '123', role: 'admin' });

      isAdmin(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('isAdminOrSelf', () => {
    it('should return 401 if no token is provided', () => {
      mockReq.header = vi.fn().mockReturnValue(undefined);
      mockReq.params = { id: '123' };

      isAdminOrSelf(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'No token, authorization denied',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 if token is invalid', () => {
      mockReq.header = vi.fn().mockReturnValue('badtoken');
      mockReq.params = { id: '123' };
      (jwt.verify as Mock).mockImplementation(() => { throw new Error('Invalid token'); });

      isAdminOrSelf(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Unauthorized: Invalid Token',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 if user is neither admin nor self', () => {
      mockReq.header = vi.fn().mockReturnValue('goodtoken');
      mockReq.params = { id: '456' };
      (jwt.verify as Mock).mockReturnValue({ _id: '123', role: 'user' });

      isAdminOrSelf(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Forbidden: Access Denied',
        status: 'error'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next if user is admin', () => {
      mockReq.header = vi.fn().mockReturnValue('goodtoken');
      mockReq.params = { id: '456' };
      (jwt.verify as Mock).mockReturnValue({ _id: '123', role: 'admin' });

      isAdminOrSelf(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should call next if user is self', () => {
      mockReq.header = vi.fn().mockReturnValue('goodtoken');
      mockReq.params = { id: '123' };
      (jwt.verify as Mock).mockReturnValue({ _id: '123', role: 'user' });

      isAdminOrSelf(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
