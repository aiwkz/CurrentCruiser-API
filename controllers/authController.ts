import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import User, { type IUser } from '../models/User.ts';
import { createJwtToken } from '../middlewares/authMiddleware.ts';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      res.status(400).json({ message: 'User already exists', status: 'error' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    }).save();

    const token = createJwtToken(newUser);

    // Convert doc -> plain object, then strip password
    const userObj = newUser.toObject() as IUser;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = userObj;

    res.status(201).json({
      status: 'ok',
      message: 'User registered!',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean<IUser>();
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials', status: 'error' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials', status: 'error' });
      return;
    }

    const token = createJwtToken(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...safeUser } = user;

    res.status(200).json({
      status: 'ok',
      message: 'User logged in correctly!',
      token,
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
};
