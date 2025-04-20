import type { Request, Response, NextFunction } from 'express';
import List, { type IList } from '@models/List.ts';

export const createList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user_id, title, cars } = req.body;

    if (!title) {
      res.status(400).json({ msg: 'Title is a required field', status: 'error' });
      return;
    }

    const newList = new List({ user_id, title, cars });
    await newList.save();

    res.status(200).json({ msg: 'List created successfully', list: newList, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getAllLists = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lists: IList[] = await List.find({ deleted_at: null });

    if (lists.length === 0) {
      res.status(404).json({ msg: 'No lists found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'All lists', lists, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getListById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundList = await List.findById(id);

    if (!foundList) {
      res.status(404).json({ msg: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Found list', list: foundList, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getListsByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.params;
    const userLists: IList[] = await List.find({ user_id: userId, deleted_at: null });

    if (userLists.length === 0) {
      res.status(404).json({ msg: 'No lists found for this user', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Lists found for this user', lists: userLists, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { user_id, title, cars } = req.body;

    if (!title) {
      res.status(400).json({ msg: 'Title is a required field', status: 'error' });
      return;
    }

    const updateFields = {
      ...(user_id && { user_id }),
      ...(title && { title }),
      ...(cars && { cars }),
      updated_at: new Date().toISOString(),
    };

    const updatedList = await List.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });

    if (!updatedList) {
      res.status(404).json({ msg: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'List updated successfully', list: updatedList, status: 'ok' });
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
      res.status(404).json({ msg: 'List not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'List deleted successfully', list: listToDelete, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
