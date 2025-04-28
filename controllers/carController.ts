import type { Request, Response, NextFunction } from 'express';
import Car, { type ICar } from '../models/Car.ts';

export const createCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const newCar = new Car({
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    await newCar.save();

    res.status(201).json({ message: 'Car created successfully', car: newCar, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getAllCars = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const cars: ICar[] = await Car.find({ deleted_at: null });

    if (cars.length === 0) {
      res.status(404).json({ message: 'No cars found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'All cars list', cars, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const getCarById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const foundCar = await Car.findById(id);

    if (!foundCar) {
      res.status(404).json({ message: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Found car', car: foundCar, status: 'ok' });
  } catch (error) {
    next(error);
  }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const updateFields = {
      ...req.body,
      updated_at: new Date().toISOString(),
    };

    const updatedCar = await Car.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updatedCar) {
      res.status(404).json({ message: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Car updated successfully', car: updatedCar, status: 'ok' });
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
      res.status(404).json({ message: 'Car not found', status: 'error' });
      return;
    }

    res.status(200).json({ message: 'Car deleted successfully', car: carToDelete, status: 'ok' });
  } catch (error) {
    next(error);
  }
};
