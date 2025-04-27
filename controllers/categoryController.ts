import type { Request, Response, NextFunction } from 'express';
import Category, { type ICategory } from '@models/Category.ts';

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name } = req.body;
    const newCategory = new Category({ name });
    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories: ICategory[] = await Category.find();

    if (categories.length === 0) {
      res.status(404).json({ message: 'No categories found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'All categories', categories, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundCategory = await Category.findById(id);

    if (!foundCategory) {
      res.status(404).json({ message: 'Category not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Found category', category: foundCategory, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: id },
      { $set: { name } },
      { new: true }
    );

    if (!updatedCategory) {
      res.status(404).json({ message: 'Category not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const categoryToDelete = await Category.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!categoryToDelete) {
      res.status(404).json({ message: 'Category not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Category deleted successfully', category: categoryToDelete, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
