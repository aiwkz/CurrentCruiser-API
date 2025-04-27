import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import type { JwtPayload, AuthenticatedUser } from 'auth.d.ts';
import { AppError } from '@utils/appError.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError('❌ JWT_SECRET is not defined in environment variables', 500, false);
}

const getUserFromJWT = (token: string | undefined): AuthenticatedUser | null => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded.user;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Error decoding JWT:', message);
    return null;
  }
};

export default getUserFromJWT;
