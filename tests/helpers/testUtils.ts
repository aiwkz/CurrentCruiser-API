import jwt from 'jsonwebtoken';

export const createTestJwtToken = (userId: string, role = 'user', secret = process.env.JWT_SECRET!): string => {
  return jwt.sign({ userId, role }, secret, { expiresIn: '7d' });
};
