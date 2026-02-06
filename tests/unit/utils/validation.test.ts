import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import jwt from 'jsonwebtoken';

import getUserFromJWT from '../../../utils/validation.ts';
import { AuthenticatedUser } from '../../../types/auth.ts';
import { AppError } from '../../../utils/appError.ts';

describe('getUserFromJWT', () => {
  vi.mock('jsonwebtoken', async () => {
    const actual = await vi.importActual<typeof import('jsonwebtoken')>('jsonwebtoken');
    return {
      ...actual,
      default: {
        ...actual,
        verify: vi.fn(),
      },
    };
  });

  const mockUser: AuthenticatedUser = { userId: '123', role: 'admin' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return user if token is valid', () => {
    (jwt.verify as Mock).mockReturnValue({ user: mockUser });

    const result = getUserFromJWT('valid-token');
    expect(result).toEqual(mockUser);
  });

  it('should return null if no token is provided', () => {
    const result = getUserFromJWT(undefined);
    expect(result).toBeNull();
    expect(jwt.verify).not.toHaveBeenCalled();
  });

  it('should return null if jwt throws error', () => {
    (jwt.verify as Mock).mockImplementation(() => {
      throw new AppError('Invalid token', 401, true);

    });

    const result = getUserFromJWT('invalid-token');
    expect(result).toBeNull();
  });
});
