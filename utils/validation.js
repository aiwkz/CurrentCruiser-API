import jwt from 'jsonwebtoken';

const getUserFromJWT = (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user;
  } catch (error) {
    console.error('Error decoding JWT:', error.message);
    return null;
  }
};

export default getUserFromJWT;
