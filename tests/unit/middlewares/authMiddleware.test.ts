import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createJwtToken, verifyToken } from '@middlewares/authMiddleware.ts';
import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedUser } from '@types/auth.ts';

const mockUser: AuthenticatedUser = { userId: 'abc123', role: 'admin' };

let mockReq: Partial<Request>;
let mockRes: Partial<Response>;
let mockNext: NextFunction;

beforeEach(() => {
  mockReq = {
    header: () => undefined,
  };

  mockRes = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };

  mockNext = vi.fn();
});

describe('authMiddleware - createJwtToken', () => {
  it('should create and verify a real token with correct payload', () => {
    const token = createJwtToken({ _id: mockUser.userId, role: mockUser.role });

    expect(typeof token).toBe('string');
    const parts = token.split('.');
    expect(parts.length).toBe(3); // Check for JWT structure
  });
});

describe('authMiddleware - verifyToken', () => {
  it('should return 401 if no token is found', () => {
    mockReq.header = () => undefined;

    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'No token found' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 403 for invalid token', () => {
    mockReq = {
      header(name: string): string | undefined {
        return 'Bearer invalid.token';
      },
    } as Partial<Request>;

    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Invalid token' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next and set req.user for valid token', () => {
    const token = createJwtToken({ _id: mockUser.userId, role: mockUser.role });
    mockReq = {
      header(name: string): string | undefined {
        return name === 'Authorization' ? `Bearer ${token}` : undefined;
      },
      user: undefined
    } as Partial<Request> & { user?: AuthenticatedUser };

    verifyToken(mockReq as Request, mockRes as Response, mockNext);

    expect(mockReq.user).toMatchObject({ userId: mockUser.userId, role: mockUser.role });
    expect(mockNext).toHaveBeenCalled();
  });
});
