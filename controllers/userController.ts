import type { Request, Response, NextFunction } from 'express';
import User, { type IUser } from '@models/User.ts';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users: IUser[] = await User.find({ deleted_at: null });

    if (users.length === 0) {
      res.status(404).json({ msg: 'No active users found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'All users list', users, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);

    if (!foundUser) {
      res.status(404).json({ msg: 'User not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Found user', user: foundUser, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!username && !email && !password) {
      res.status(400).json({
        msg: 'At least one of username, email, or password is required',
        status: 'error',
      });
      return;
    }

    const updateFields = {
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }),
      updated_at: new Date().toISOString(),
    };

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updatedUser) {
      res.status(404).json({ msg: 'User not found', status: 'error' });
      return;
    }

    type SafeUser = Omit<IUser, 'password'> & { password?: string };

    const userWithoutPassword: SafeUser = updatedUser;
    delete userWithoutPassword.password;

    res.status(200).json({ msg: 'User updated successfully', user: userWithoutPassword, status: 'ok' });

  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const userToDelete = await User.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!userToDelete) {
      res.status(404).json({ msg: 'User not found', status: 'error' });
      return;
    }

    type SafeUser = Omit<IUser, 'password'> & { password?: string };

    const userWithoutPassword: SafeUser = userToDelete;
    delete userWithoutPassword.password;

    res.status(200).json({ msg: 'User deleted successfully', user: userWithoutPassword, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
