import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is not defined in environment variables');
}

interface JwtUserPayload {
  _id: string;
  role: string;
}

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied', status: 'error' });
    return;
  }

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    if (decodedUser.role === 'admin') {
      return next();
    }

    res.status(403).json({ message: 'Access forbidden. Admin role required.', status: 'error' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Unauthorized:', message);
    res.status(401).json({ message: 'Invalid token', status: 'error' });
  }
};

export const isAdminOrSelf = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  const token = req.header('Authorization');

  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied', status: 'error' });
    return;
  }

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    if (decodedUser.role === 'admin' || decodedUser._id === id) {
      return next();
    }

    res.status(403).json({ message: 'Forbidden: Access Denied', status: 'error' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Unauthorized:', message);
    res.status(401).json({ message: 'Unauthorized: Invalid Token', status: 'error' });
  }
};
