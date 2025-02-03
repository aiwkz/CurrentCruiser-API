import bcrypt from 'bcryptjs';

import User from '../models/User.js';
import { createJwtToken } from '../middlewares/authMiddleware.js';

// Function to register a new user
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email }).lean();

    if (user) {
      return res.status(400).json({ msg: 'User already exists', status: 'error' });
    }

    // Create a new user instance
    user = new User({
      username,
      email,
      password,
      role: 'user'
    });

    // Encrypt the password
    const saltRounds = 10;
    user.password = await bcrypt.hash(password, saltRounds);

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = createJwtToken(user);

    delete user.password;

    res.status(200).json({ msg: 'User registered!', jwttoken: token, user: user, status: 'ok' })
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

// Function to log in a user
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials', status: 'error' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials', status: 'error' });
    }

    // Generate JWT token
    const token = createJwtToken(user);

    delete user.password;

    res.status(200).json({ msg: 'User logged in correctly!', jwttoken: token, user: user, status: 'ok' })
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};
