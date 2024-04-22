import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
  try {
    // Find all users that do not have a deleted_at timestamp
    const users = await User.find({ deleted_at: { $exists: true } });

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

    // Send a 200 response with the user
    res.status(200).json({ msg: 'Found user', user: foundUser, status: 'ok' });
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
    const { username, email, password } = req.body;

    // Check if the user exists
    const foundUser = await User.findById(id).lean();

    if (!foundUser) {
      return res.status(404).json({ msg: 'User not found', status: 'error' });
    }

    // Update user data
    const updatedUser = {
      ...foundUser, // Convert Mongoose document to plain JavaScript object
      username: username && username,
      email: email && email,
      password: password && password,
      updated_at: new Date().toISOString(), // Add date to updated_at and convert it to ISO string format
    };

    // Save the updated user to the database
    const userAfterUpdate = await User.findByIdAndUpdate(
      id,
      updatedUser,
      { new: true }
    ).lean();

    // Delete the password field from the updated user object
    delete userAfterUpdate.password;

    // Send a 200 response with the updated user
    res.status(200).json({ msg: 'User updated successfully', user: userAfterUpdate, status: 'ok' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', status: 'error' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    // Extract the user ID from the request parameters
    const { id } = req.params;

    // Update the user in the database with the deleted_at field
    const userToDelete = await User.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    // Check if the user exists
    if (!userToDelete) {
      // If user not found, send a 404 response with a message
      return res.status(404).json({ msg: 'User not found', status: 'error' });
    }

    // Delete the password field
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
