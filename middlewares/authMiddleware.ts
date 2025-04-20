import * as jwt from 'jsonwebtoken';
import { type JwtPayload } from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

interface UserPayload extends JwtPayload {
  userId: string;
  role: string;
}

export const createJwtToken = (user: { _id: unknown; role: string }): string => {
  const payload: UserPayload = {
    userId: user._id?.toString?.() ?? '',
    role: user.role,
  };

  return jwt.default.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const header = req.header('Authorization') || '';
  const token = header.split(' ')[1];

  if (!token) {
    res.status(401).json({ msg: 'No token found' });
    return;
  }

  try {
    const payload = jwt.default.verify(token, JWT_SECRET) as UserPayload;
    req.user = payload;
    next();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Token error:', message);
    res.status(403).json({ msg: 'Invalid token' });
  }
};
