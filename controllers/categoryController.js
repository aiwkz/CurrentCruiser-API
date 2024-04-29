import Category from '../models/Category.js';

export const createCategory = async (req, res, next) => {
  try {
    // Extract category name from the request body
    const { name } = req.body;

    // Check if required fields are missing
    if (!name) {
      // If name is not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Name is a required field', status: 'error' });
    }

    // Create the category object
    const newCategory = new Category({
      name
    });

    // Save the new category to the database
    await newCategory.save();

    // Send a 200 response with the created category
    res.status(200).json({ msg: 'Category created successfully', category: newCategory, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const getAllCategories = async (req, res, next) => {
  try {
    // Retrieve all categories from the database
    const categories = await Category.find();

    // Check if there are no categories
    if (categories.length === 0) {
      // If there are no categories found, send a 404 response with a message
      return res.status(404).json({ msg: 'No categories found', status: 'error' });
    }

    // Send a 200 response with the categories array
    res.status(200).json({ msg: 'All categories', categories, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    // Extract the category ID from the request parameters
    const { id } = req.params;

    // Find the category by ID in the database
    const foundCategory = await Category.findById(id);

    // Check if the category exists
    if (!foundCategory) {
      // If category was not found, send a 404 response with a message
      return res.status(404).json({ msg: 'Category not found', status: 'error' });
    }

    // Send a 200 response with the category
    res.status(200).json({ msg: 'Found category', category: foundCategory, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    // Extract category ID from request parameters
    const { id } = req.params;

    // Extract category name from request body
    const { name } = req.body;

    // Check if required fields are missing
    if (!name) {
      // If name is not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Name is a required field', status: 'error' });
    }

    // Construct update object with provided fields
    const updateFields = {
      name
    };

    // Find and update the category in the database
    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    // Check if the category exists
    if (!updatedCategory) {
      return res.status(404).json({ msg: 'Category not found', status: 'error' });
    }

    // Send a 200 response with the updated category
    res.status(200).json({ msg: 'Category updated successfully', category: updatedCategory, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    // Extract the category ID from the request parameters
    const { id } = req.params;

    // Update the category in the database with the deleted_at field
    const categoryToDelete = await List.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    // Check if the category exists
    if (!categoryToDelete) {
      // If category not found, send a 404 response with a message
      return res.status(404).json({ msg: 'Category not found', status: 'error' });
    }

    // Send a 200 response with a success message
    res.status(200).json({ msg: 'Category deleted successfully', category: categoryToDelete, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};
