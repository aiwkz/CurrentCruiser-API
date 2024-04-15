import jwt from 'jsonwebtoken';

export const createJwtToken = (user) => {
  const secretKey = process.env.JWT_SECRET;

  const payload = {
    userId: user._id,
    role: user.role,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '7d' });

  return token;
}

export const verifyToken = (req, res, next) => {
  const header = req.header('Authorization') || '';
  const token = header.split(' ')[1];
  const secretKey = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({ msg: 'No token found' });
  };

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;

    next();
  } catch (error) {
    return res.status(403).json({ msg: 'Invalid token' });
  }
}
