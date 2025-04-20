import request from 'supertest';
import mongoose from 'mongoose';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';
import type { Application, Request, Response, NextFunction } from 'express';
import type { Model, Document } from 'mongoose';
import type { ICategory } from '@models/Category.ts';

vi.mock('@middlewares/auth', () => ({
  auth: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('@middlewares/validationMiddleware.ts', () => ({
  isAdmin: (_req: Request, _res: Response, _next: NextFunction) => _next(),
  isAdminOrSelf: (_req: Request, _res: Response, _next: NextFunction) => _next(),
}));

let app: Application;
let Category: Model<ICategory & Document>;

beforeAll(async () => {
  const appModule = await import('server.ts');
  const categoryModule = await import('@models/Category.ts');

  app = appModule.app;
  Category = categoryModule.default;
});

describe('POST /api/categories/create', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should create a category with valid input', async () => {
    const res = await request(app).post('/api/categories/create').send({ name: 'SUV' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.category.name).toBe('SUV');
  });

  it('should return 400 if category name is missing', async () => {
    const res = await request(app).post('/api/categories/create').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Name is a required field');
  });
});

describe('GET /api/categories/all', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should return 404 when no categories exist', async () => {
    const res = await request(app).get('/api/categories/all');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('No categories found');
  });

  it('should return 200 with a list of categories', async () => {
    await Category.create({ name: 'Sedan' });
    const res = await request(app).get('/api/categories/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(res.body.categories.length).toBe(1);
    expect(res.body.categories[0].name).toBe('Sedan');
  });
});

describe('GET /api/categories/:id', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should return a category by id', async () => {
    const category = await Category.create({ name: 'Hatchback' });
    const res = await request(app).get(`/api/categories/${category._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.category.name).toBe('Hatchback');
  });

  it('should return 404 if category not found', async () => {
    const res = await request(app).get(`/api/categories/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Category not found');
  });
});

describe('PUT /api/categories/:id', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should update a category with valid input', async () => {
    const category = await Category.create({ name: 'Coupe' });
    const res = await request(app).put(`/api/categories/${category._id}`).send({ name: 'Updated Coupe' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.category.name).toBe('Updated Coupe');
  });

  it('should return 404 for non-existent category', async () => {
    const res = await request(app).put(`/api/categories/${new mongoose.Types.ObjectId()}`).send({ name: 'Ghost' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Category not found');
  });

  it('should return 400 if no name is provided', async () => {
    const category = await Category.create({ name: 'Convertible' });
    const res = await request(app).put(`/api/categories/${category._id}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Name is a required field');
  });
});

describe('DELETE /api/categories/:id', () => {
  beforeEach(async () => {
    await Category.deleteMany({});
  });

  it('should soft delete a category', async () => {
    const category = await Category.create({ name: 'Van' });
    const res = await request(app).delete(`/api/categories/${category._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.msg).toBe('Category deleted successfully');
    expect(res.body.category.deleted_at).toBeDefined();
  });

  it('should return 404 if category does not exist', async () => {
    const res = await request(app).delete(`/api/categories/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('Category not found');
  });
});
