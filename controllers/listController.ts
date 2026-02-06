import type { Request, Response, NextFunction } from 'express';

import List, { type IList } from '../models/List.ts';

export const createList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user_id, title, cars } = req.body;
    const newList = new List({ user_id, title, cars });
    await newList.save();

    res.status(201).json({ message: 'List created successfully', list: newList, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getAllLists = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lists: IList[] = await List.find({ deleted_at: null });

    if (lists.length === 0) {
      res.status(404).json({ message: 'No lists found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'All lists', lists, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getListById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundList = await List.findById(id);

    if (!foundList) {
      res.status(404).json({ message: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Found list', list: foundList, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getListsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const userLists: IList[] = await List.find({ user_id: userId, deleted_at: null });

    if (userLists.length === 0) {
      res.status(404).json({ message: 'No lists found for this user', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Lists found for this user', lists: userLists, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateFields = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const updatedList = await List.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true }).lean();

    if (!updatedList) {
      res.status(404).json({ message: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'List updated successfully', list: updatedList, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const deleteList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const listToDelete = await List.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!listToDelete) {
      res.status(404).json({ message: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'List deleted successfully', list: listToDelete, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
