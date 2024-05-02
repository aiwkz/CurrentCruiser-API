import Car from '../models/Car.js';

export const createCar = async (req, res, next) => {
  try {
    // Extract car details from the request body
    const {
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market
    } = req.body;

    // Check if required fields are missing
    if (!name || !available_in_market) {
      // If name or available_in_market are not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Name and available_in_market are required fields', status: 'error' });
    }

    // Create the car object with deleted_at set to null
    const newCar = new Car({
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market
    });

    // Save the new car to the database
    await newCar.save();

    // Send a 200 response with the created car
    res.status(200).json({ msg: 'Car created successfully', car: newCar, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const getAllCars = async (req, res, next) => {
  try {
    // Retrieve all cars from the database
    const cars = await Car.find({ deleted_at: null });

    // Check if there are no cars
    if (cars.length === 0) {
      // If there are no cars found, send a 404 response with a message
      return res.status(404).json({ msg: 'No cars found', status: 'error' });
    }

    // Send a 200 response with the cars array
    res.status(200).json({ msg: 'All cars list', cars: cars, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const getCarById = async (req, res, next) => {
  try {
    // Extract the car ID from the request parameters
    const { id } = req.params;

    // Find the car by ID in the database
    const foundCar = await Car.findById(id);

    // Check if the car exists
    if (!foundCar) {
      // If car was not found, send a 404 response with a message
      return res.status(404).json({ msg: 'Car not found', status: 'error' });
    }

    // Send a 200 response with the car
    res.status(200).json({ msg: 'Found car', car: foundCar, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};

export const updateCar = async (req, res, next) => {
  try {
    // Extract car ID from request parameters
    const { id } = req.params;

    // Extract car details from request body
    const {
      name,
      history,
      description,
      specifications,
      category_id,
      available_in_market
    } = req.body;

    // Check if required fields are missing
    if (!name || !available_in_market) {
      // If name or available_in_market are not found on the req.body, send a 400 response with a message
      return res.status(400).json({ msg: 'Name and available_in_market are required fields', status: 'error' });
    }

    // Construct update object with provided fields
    const updateFields = {
      name: name && name,
      history: history && history,
      description: description && description,
      specifications: specifications && specifications,
      category_id: category_id && category_id,
      available_in_market: available_in_market && available_in_market,
      updated_at: new Date().toISOString(), // Add date to updated_at and convert it to ISO string format
    };

    // Find and update the car in the database
    const updatedCar = await Car.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );

    // Check if the car exists
    if (!updatedCar) {
      return res.status(404).json({ msg: 'Car not found', status: 'error' });
    }

    // Send a 200 response with the updated car
    res.status(200).json({ msg: 'Car updated successfully', car: updatedCar, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};


export const deleteCar = async (req, res, next) => {
  try {
    // Extract the car ID from the request parameters
    const { id } = req.params;

    // Update the car in the database with the deleted_at field
    const carToDelete = await Car.findByIdAndUpdate(
      id,
      { deleted_at: new Date().toISOString() },
      { new: true }
    ).lean();

    // Check if the car exists
    if (!carToDelete) {
      // If car not found, send a 404 response with a message
      return res.status(404).json({ msg: 'Car not found', status: 'error' });
    }

    // Send a 200 response with a success message
    res.status(200).json({ msg: 'Car deleted successfully', car: carToDelete, status: 'ok' });
  } catch (error) {
    // Pass the error to the next middleware (errorHandler)
    next(error);
  }
};
