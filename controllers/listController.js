import List from '../models/List.js';

export const createList = async (req, res, next) => {
  try {
    // Extract list details from the request body
    const {
      user_id,
      title,
      cars
    } = req.body;

    // Check if required fields are missing
    if (!title) {
      // If title is not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Title is a required field', status: 'error' });
    }

    // Create the list object with deleted_at set to null
    const newList = new List({
      user_id,
      title,
      cars
    });

    // Save the new list to the database
    await newList.save();

    // Send a 200 response with the created list
    res.status(200).json({ msg: 'List created successfully', list: newList, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};

export const getAllLists = async (req, res, next) => {
  try {
    // Retrieve all lists from the database
    const lists = await List.find({ deleted_at: null });

    // Check if there are no lists
    if (lists.length === 0) {
      // If there are no lists found, send a 404 response with a message
      return res.status(404).json({ msg: 'No lists found', status: 'error' });
    }

    // Send a 200 response with the lists array
    res.status(200).json({ msg: 'All lists', lists: lists, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};

export const getListById = async (req, res, next) => {
  try {
    // Extract the list ID from the request parameters
    const { id } = req.params;

    // Find the list by ID in the database
    const foundList = await List.findById(id);

    // Check if the list exists
    if (!foundList) {
      // If list was not found, send a 404 response with a message
      return res.status(404).json({ msg: 'List not found', status: 'error' });
    }

    // Send a 200 response with the list
    res.status(200).json({ msg: 'Found list', list: foundList, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};

export const getListsByUserId = async (req, res, next) => {
  try {
    // Extract the user ID from the request parameters
    const { userId } = req.params;

    // Find all lists associated with the user ID in the database
    const userLists = await List.find({ user_id: userId, deleted_at: null });

    // Check if there are no lists associated with the user
    if (userLists.length === 0) {
      // If there are no lists found, send a 404 response with a message
      return res.status(404).json({ msg: 'No lists found for this user', status: 'error' });
    }

    // Send a 200 response with the lists associated with the user
    res.status(200).json({ msg: 'Lists found for this user', lists: userLists, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};

export const updateList = async (req, res, next) => {
  try {
    // Extract list ID from request parameters
    const { id } = req.params;

    // Extract list details from request body
    const {
      user_id,
      title,
      cars
    } = req.body;

    // Check if required fields are missing
    if (!title) {
      // If title is not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Title is a required field', status: 'error' });
    }

    // Construct update object with provided fields
    const updateFields = {
      user_id: user_id && user_id,
      title: title && title,
      cars: cars && cars,
      updated_at: new Date().toISOString(), // Add date to updated_at and convert it to ISO string format
    };

    // Find and update the list in the database
    const updatedList = await List.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    // Check if the list exists
    if (!updatedList) {
      return res.status(404).json({ msg: 'List not found', status: 'error' });
    }

    // Send a 200 response with the updated list
    res.status(200).json({ msg: 'List updated successfully', list: updatedList, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};

export const deleteList = async (req, res, next) => {
  try {
    // Extract the list ID from the request parameters
    const { id } = req.params;

    // Update the list in the database with the deleted_at field
    const listToDelete = await List.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    // Check if the list exists
    if (!listToDelete) {
      // If list not found, send a 404 response with a message
      return res.status(404).json({ msg: 'List not found', status: 'error' });
    }

    // Send a 200 response with a success message
    res.status(200).json({ msg: 'List deleted successfully', list: listToDelete, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (i.e., the errorHandler)
    next(error);
  }
};
