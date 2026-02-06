import request from 'supertest';
import mongoose from 'mongoose';
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';

import type { Application, Request, Response, NextFunction } from 'express';
import type { Model } from 'mongoose';

import type { IUser } from '../../models/User.ts';

vi.mock('../../utils/auth.ts', () => ({
  auth: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('../../middlewares/validationMiddleware.ts', () => ({
  isAdmin: (_req: Request, _res: Response, next: NextFunction) => next(),
  isAdminOrSelf: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

let app: Application;
let User: Model<IUser>;

beforeAll(async () => {
  const appModule = await import('../../server.ts');
  app = appModule.app;

  const userModule = await import('../../models/User.ts');
  User = userModule.default;
});

describe('POST /api/users/create', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should create a user with valid input', async () => {
    const res = await request(app).post('/api/users/create').send({
      username: 'newuser',
      email: 'newuser@test.com',
      password: 'securepw',
      role: 'user',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('ok');
    expect(res.body.user.username).toBe('newuser');
    expect(res.body.user).not.toHaveProperty('password');
  });
});

describe('GET /api/users/all', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return 404 when no users exist', async () => {
    const res = await request(app).get('/api/users/all');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('No active users found');
  });

  it('should return 200 and a list of users', async () => {
    await User.create({ username: 'john', email: 'john@test.com', password: '1234', role: 'user' });
    const res = await request(app).get('/api/users/all');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBe(1);
    expect(res.body.users[0].username).toBe('john');
  });
});

describe('GET /api/users/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return 200 when user exists', async () => {
    const user = await User.create({ username: 'jane', email: 'jane@test.com', password: 'abcd', role: 'user' });
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.user.username).toBe('jane');
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app).get(`/api/users/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('User not found');
  });
});

describe('PUT /api/users/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should update a user with valid fields', async () => {
    const user = await User.create({ username: 'old', email: 'old@test.com', password: 'pw', role: 'user' });

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .send({
        username: 'new',
        email: user.email,
        password: user.password,
        role: user.role,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.user.username).toBe('new');
  });

  it('should return 404 when updating non-existent user', async () => {
    const res = await request(app).put(`/api/users/${new mongoose.Types.ObjectId()}`).send({ username: 'ghost' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('User not found');
  });
});

describe('DELETE /api/users/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should soft delete user', async () => {
    const user = await User.create({ username: 'temp', email: 'temp@test.com', password: 'pw', role: 'user' });

    const res = await request(app)
      .delete(`/api/users/${user._id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.message).toBe('User deleted successfully');
    expect(res.body.user.deleted_at).toBeDefined();
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app).delete(`/api/users/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.message).toBe('User not found');
  });
});
