import jwt from 'jsonwebtoken';

export const isAdmin = (req, res, next) => {
  // Check if Authorization header is present
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied', status: 'error' });
  }

  try {

    // Verify and decode the JWT
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user has admin role
    if (decodedUser.role === 'admin') {
      // If user is admin, allow access to the next middleware or endpoint
      return next();
    }

    // If user is not admin, send a 403 Forbidden response
    return res.status(403).json({ message: 'Access forbidden. Admin role required.', status: 'error' });
  } catch (error) {
    // If token is invalid, send a 401 Unauthorized response
    return res.status(401).json({ message: 'Invalid token', status: 'error' });
  }
};


export const isAdminOrSelf = (req, res, next) => {
  try {
    // Extract user ID from request params
    const { id } = req.params;

    // Verify and decode the JWT
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user has admin role
    if (decodedUser.role === 'admin') {
      // If user is admin, allow access to the next middleware or endpoint
      return next();
    }

    // Check if the user ID matches the ID of the user to be deleted
    if (decodedUser._id === id) {
      // If the user ID matches, allow the operation
      return next();
    }

    // If neither an admin nor the same user, deny the operation
    return res.status(403).json({ message: 'Forbidden: Access Denied', status: 'error' });
  } catch (error) {
    // If there's an error with JWT verification, deny the operation
    return res.status(401).json({ message: 'Unauthorized: Invalid Token', status: 'error' });
  }
};
