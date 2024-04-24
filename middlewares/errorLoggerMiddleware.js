import ErrorLog from '../models/ErrorLog.js';
import getUserFromJWT from '../utils/validation.js';

const errorLogger = async (error, req, res, next) => {
  try {
    // Extract error details
    const errorMessage = error.message;
    const timestamp = new Date().toISOString();
    const route = req.originalUrl;
    const user = getUserFromJWT(req.headers.authorization?.split(' ')[1]);

    // Log error to the database
    await ErrorLog.create({ message: errorMessage, timestamp, route, user });

    // Pass the error to the next middleware
    next(error);
  } catch (tryError) {
    // If logging the error fails, log the error to the console
    console.error('Error logging failed:', tryError);
    next(error); // Pass the original error to the next middleware
  }
};

export default errorLogger;
