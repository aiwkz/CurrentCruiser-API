import type { Request, Response, NextFunction } from 'express';
import ErrorLog from '@models/ErrorLog.ts';
import getUserFromJWT from '@utils/validation.ts';

const errorLogger = async (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const errorMessage = error.message;
    const timestamp = new Date().toISOString();
    const route = req.originalUrl;
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : undefined;
    const user = getUserFromJWT(token) || 'unauthenticated';

    await ErrorLog.create({
      message: errorMessage,
      timestamp,
      route,
      user: user || 'unauthenticated'
    });

    next(error);
  } catch (tryError) {
    console.error('❌ Error logging failed:', tryError);
    next(error);
  }
};

export default errorLogger;
