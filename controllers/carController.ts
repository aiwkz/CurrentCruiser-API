import type { Request, Response, NextFunction } from 'express';
import Car, { type ICar } from '@models/Car.ts';

export const createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market,
    } = req.body;

    if (!name || available_in_market === undefined) {
      res.status(400).json({
        msg: 'Name and available_in_market are required fields',
        status: 'error',
      });
      return;
    }

    const newCar = new Car({
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market,
    });

    await newCar.save();

    res.status(200).json({ msg: 'Car created successfully', car: newCar, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getAllCars = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cars: ICar[] = await Car.find({ deleted_at: null });

    if (cars.length === 0) {
      res.status(404).json({ msg: 'No cars found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'All cars list', cars, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundCar = await Car.findById(id);

    if (!foundCar) {
      res.status(404).json({ msg: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Found car', car: foundCar, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market,
    } = req.body;

    if (!name || available_in_market === undefined) {
      res.status(400).json({
        msg: 'Name and available_in_market are required fields',
        status: 'error',
      });
      return;
    }

    const updateFields = {
      ...(name && { name }),
      ...(history && { history }),
      ...(description && { description }),
      ...(specifications && { specifications }),
      ...(category_id && { category_id }),
      ...(available_in_market !== undefined && { available_in_market }),
      updated_at: new Date().toISOString(),
    };

    const updatedCar = await Car.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedCar) {
      res.status(404).json({ msg: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Car updated successfully', car: updatedCar, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const deleteCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const carToDelete = await Car.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    if (!carToDelete) {
      res.status(404).json({ msg: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ msg: 'Car deleted successfully', car: carToDelete, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
