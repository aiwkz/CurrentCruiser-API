import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

import User, { type IUser } from '../models/User.ts';
import { createJwtToken } from '../middlewares/authMiddleware.ts';

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      res.status(400).json({ message: 'User already exists', status: 'error' });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();

    const token = createJwtToken(newUser);

    type SafeUser = Omit<IUser, 'password'> & { password?: string };

    const userWithoutPassword: SafeUser = newUser;
    delete userWithoutPassword.password;

    res.status(201).json({
      message: 'User registered!',
      jwttoken: token,
      user: userWithoutPassword,
      status: 'ok',
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean();

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

    type SafeUser = Omit<IUser, 'password'> & { password?: string };

    const userWithoutPassword: SafeUser = user;
    delete userWithoutPassword.password;

    res.status(200).json({
      message: 'User logged in correctly!',
      token,
      user: userWithoutPassword,
      status: 'ok',
    });
  } catch (error) {
    next(error);
  }
};
