import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import logger from '../utils/logger.ts';
import { AppError } from '../utils/appError.ts';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new AppError(
    '❌ JWT_SECRET is not defined in environment variables',
    500,
    true
  );
}

interface JwtUserPayload {
  _id: string;
  role: string;
}

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization');
  const header = authHeader || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;

  if (!token) {
    res
      .status(401)
      .json({ message: 'No token, authorization denied', status: 'error' });
    return;
  }

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    if (decodedUser.role === 'admin') {
      return next();
    }

    res.status(403).json({
      message: 'Access forbidden. Admin role required.',
      status: 'error',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Unauthorized:', message);
    res.status(401).json({ message: 'Invalid token', status: 'error' });
  }
};

export const isAdminOrSelf = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { id } = req.params;
  const header = req.header('Authorization') || '';
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;

  if (!token) {
    res
      .status(401)
      .json({ message: 'No token, authorization denied', status: 'error' });
    return;
  }

  try {
    const decodedUser = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

    if (decodedUser.role === 'admin' || decodedUser._id === id) {
      return next();
    }

    res
      .status(403)
      .json({ message: 'Forbidden: Access Denied', status: 'error' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('Unauthorized:', message);
    res
      .status(401)
      .json({ message: 'Unauthorized: Invalid Token', status: 'error' });
  }
};
