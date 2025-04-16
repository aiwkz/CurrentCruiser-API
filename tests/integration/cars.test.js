import request from 'supertest';
import mongoose from 'mongoose';
import { vi } from 'vitest';

// Mock the middleware
vi.mock('../../middlewares/validationMiddleware.js', () => ({
  isAdmin: (req, res, next) => next(),
  isAdminOrSelf: (req, res, next) => next()
}));

let app;
let Car;

beforeAll(async () => {
  // Load modules after mocking
  const appModule = await import('../../server.js');
  app = appModule.app;

  const carModule = await import('../../models/Car.js');
  Car = carModule.default;
});

describe('GET /api/cars/all', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should return 404 when no cars are in the DB', async () => {
    const res = await request(app).get('/api/cars/all');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('No cars found');
  });

  it('should return 200 and list of cars when data exists', async () => {
    await Car.create({
      name: 'Test Car',
      history: 'Some history',
      description: 'Test car description',
      specifications: {},
      category_id: new mongoose.Types.ObjectId(),
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
    const car = await Car.create({ name: 'Model X', available_in_market: true });
    const res = await request(app).get(`/api/cars/${car._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('Model X');
  });

  it('should return 404 if car does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/cars/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Car not found');
  });
});

describe('POST /api/cars/create', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should create a car with valid input', async () => {
    const res = await request(app).post('/api/cars/create').send({
      name: 'Model Y',
      available_in_market: true
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('Model Y');
  });

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/api/cars/create').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Name and available_in_market are required fields');
  });
});

describe('PUT /api/cars/:id', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should update a car when data is valid', async () => {
    const car = await Car.create({ name: 'Old Name', available_in_market: true });
    const res = await request(app).put(`/api/cars/${car._id}`).send({
      name: 'New Name',
      available_in_market: true
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.car.name).toBe('New Name');
  });

  it('should return 404 if trying to update a non-existent car', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).put(`/api/cars/${fakeId}`).send({
      name: 'Ghost',
      available_in_market: true
    });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Car not found');
  });

  it('should return 400 when required fields are missing on update', async () => {
    const car = await Car.create({ name: 'Temp', available_in_market: true });
    const res = await request(app).put(`/api/cars/${car._id}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Name and available_in_market are required fields');
  });
});

describe('DELETE /api/cars/:id', () => {
  beforeEach(async () => {
    await Car.deleteMany({});
  });

  it('should soft delete a car', async () => {
    const car = await Car.create({ name: 'ToDelete', available_in_market: true });
    const res = await request(app).delete(`/api/cars/${car._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.msg).toBe('Car deleted successfully');
    expect(res.body.car.deleted_at).toBeDefined();
  });

  it('should return 404 when trying to delete non-existent car', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/cars/${fakeId}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Car not found');
  });
});
