import bcrypt from 'bcrypt';

import User from '../models/User.js';
import { createJwtToken } from '../utils/authMiddleware.js';

export const getAllUsers = async (req, res) => {
  try {
    // Find all users that do not have a deleted_at timestamp
    const users = await User.find({ deleted_at: { $ne: null } });

    // Check if users array is empty
    if (users.length === 0) {
      return res.status(404).json({ msg: 'No active users found', status: 'error' });
    }

    // Send a 200 response with the users array
    res.status(200).json({ msg: 'All users list', users: users, status: 'ok' });
  } catch (error) {
    // Log any errors to the console
    console.error(error);
    // Send a 500 response with an error message
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};


export const getUserById = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { id } = req.params;

    // Find the user by ID in the database
    const foundUser = await User.findById(id);

    // Check if the user exists
    if (!foundUser) {
      // If user not found, send a 404 response with a message
      return res.status(404).json({ msg: 'User not found', status: 'error' });
    }

    // Send a 200 response with the user object
    res.status(200).json({ msg: 'Found user', user: foundUser, status: 'ok' });
  } catch (error) {
    // Log any errors to the console
    console.error(error);
    // Send a 500 response with an error message
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

export const createUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { username, email, password } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists', status: 'error' });
    }

    // Create a new user instance
    const newUser = new User({ username, email, password });

    // Encrypt the password
    const saltRounds = 10;
    newUser.password = await bcrypt.hash(password, saltRounds);

    // Save the user to the database
    await newUser.save();

    // Generate JWT token
    const token = createJwtToken(newUser);

    // Return success message with JWT token and user details
    res.status(200).json({ msg: 'User created successfully', jwttoken: token, user: newUser, status: 'ok' });
  } catch (error) {
    // Log any errors to the console
    console.error(error);
    // Send a 500 response with an error message
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { username, email, password } = req.body;

    // Check if the user exists
    const foundUser = await User.findById(id);

    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found', status: 'error' });
    }

    const saltRounds = 10;
    password = await bcrypt.hash(password, saltRounds);

    // Update user data
    const updatedUser = {
      ...foundUser.toObject(),
      username,
      email,
      password,
    };

    // Save the updated user
    await foundUser.save();

    delete updatedUser.password;

    res.status(200).json({ msg: 'User updated successfully', user: updatedUser, status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { id } = req.params;

    // Find the user by ID in the database
    const userToDelete = await User.findById(id);

    // Check if the user exists
    if (!userToDelete) {
      // If user not found, send a 404 response with a message
      return res.status(404).json({ msg: 'User not found', status: 'error' });
    }

    // Set the deleted_at timestamp
    userToDelete.deleted_at = new Date();

    await userToDelete.save();

    delete userToDelete.password;

    // Send a 200 response with a success message
    res.status(200).json({ msg: 'User deleted successfully', user: userToDelete, status: 'ok' });
  } catch (error) {
    // Log any errors to the console
    console.error(error);
    // Send a 500 response with an error message
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};
