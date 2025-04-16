import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import getUserFromJWT from '../../../utils/validation.js';

// Mock jwt.verify
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn()
  }
}));

describe('getUserFromJWT', () => {
  const mockUser = { id: '123', role: 'admin' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user if token is valid', () => {
    jwt.verify.mockReturnValue({ user: mockUser });

    const result = getUserFromJWT('valid-token');
    expect(result).toEqual(mockUser);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
  });

  it('should return null if no token is provided', () => {
    const result = getUserFromJWT(null);
    expect(result).toBeNull();
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should return null if jwt throws error', () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const result = getUserFromJWT('invalid-token');
    expect(result).toBeNull();
    expect(jwt.verify).toHaveBeenCalled();
  });
});
