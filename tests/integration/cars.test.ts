import request from 'supertest';
import mongoose from 'mongoose';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';

import type { Application, Request, Response, NextFunction } from 'express';
import type { Model } from 'mongoose';

import type { ICar } from '../../models/Car.ts';

vi.mock('../../utils/auth.ts', () => ({
  auth: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../../middlewares/validationMiddleware.ts', () => ({
  isAdmin: (_req: Request, _res: Response, next: NextFunction) => next(),
  isAdminOrSelf: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

let app: Application;
let Car: Model<ICar>;

beforeAll(async () => {
  const appModule = await import('../../server.ts');
  const carModule = await import('../../models/Car.ts');
  app = appModule.app;
  Car = carModule.default;
});

describe('POST /api/cars/create', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should create a car with valid input', async () => {
    const res = await request(app).post('/api/cars/create').send({
      name: 'Model Y',
      history: 'The future is here',
      description: 'Compact performance',
      specifications: {
        motor: 'Single motor',
        horsepower: '350hp',
        mph0to60: '4.9s',
        topSpeed: '220km/h',
      },
      category_id: new mongoose.Types.ObjectId().toHexString(),
      available_in_market: true,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('Model Y');
  });
});

describe('GET /api/cars/all', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should return 404 when no cars are in the DB', async () => {
    const res = await request(app).get('/api/cars/all');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('No cars found');
  });

  it('should return 200 and list of cars when data exists', async () => {
    await Car.create({
      name: 'Test Car',
      history: 'Some history',
      description: 'Test car description',
      specifications: {
        motor: 'V6',
        horsepower: '300hp',
        mph0to60: '5.5s',
        topSpeed: '250km/h',
      },
      category_id: new mongoose.Types.ObjectId().toHexString(),
      available_in_market: true,
    });

    const res = await request(app).get('/api/cars/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.cars)).toBe(true);
    expect(res.body.cars.length).toBe(1);
    expect(res.body.cars[0].name).toBe('Test Car');
  });
});

describe('GET /api/cars/:id', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should return 200 and a car when found', async () => {
    const car = await Car.create({
      name: 'Model X',
      history: 'Electric performance',
      description: 'Fast and clean',
      specifications: {
        motor: 'Dual electric',
        horsepower: '670hp',
        mph0to60: '3.1s',
        topSpeed: '250km/h',
      },
      category_id: new mongoose.Types.ObjectId().toHexString(),
      available_in_market: true,
    });

    const res = await request(app).get(`/api/cars/${car._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('Model X');
  });

  it('should return 404 if car does not exist', async () => {
    const res = await request(app).get(`/api/cars/${new mongoose.Types.ObjectId().toHexString()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Car not found');
  });
});

describe('PUT /api/cars/:id', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should update a car when data is valid', async () => {
    const car = await Car.create({
      name: 'Old Name',
      history: 'Some old history',
      description: 'Old desc',
      specifications: {
        motor: 'Inline-4',
        horsepower: '180hp',
        mph0to60: '7.5s',
        topSpeed: '180km/h',
      },
      category_id: new mongoose.Types.ObjectId().toHexString(),
      available_in_market: true,
    });

    const res = await request(app).put(`/api/cars/${car._id}`).send({
      name: 'New Name',
      available_in_market: true,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('New Name');
  });

  it('should return 404 if trying to update a non-existent car', async () => {
    const res = await request(app).put(`/api/cars/${new mongoose.Types.ObjectId().toHexString()}`).send({
      name: 'Ghost',
      available_in_market: true,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Car not found');
  });
});

describe('DELETE /api/cars/:id', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should soft delete a car', async () => {
    const car = await Car.create({
      name: 'ToDelete',
      history: 'Bye bye',
      description: 'Getting deleted',
      specifications: {
        motor: 'Gas',
        horsepower: '100hp',
        mph0to60: '10s',
        topSpeed: '160km/h',
      },
      category_id: new mongoose.Types.ObjectId().toHexString(),
      available_in_market: true,
    });

    const res = await request(app).delete(`/api/cars/${car._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('Car deleted successfully');
    expect(res.body.car.deleted_at).toBeDefined();
  });

  it('should return 404 when trying to delete non-existent car', async () => {
    const res = await request(app).delete(`/api/cars/${new mongoose.Types.ObjectId().toHexString()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('Car not found');
  });
});
