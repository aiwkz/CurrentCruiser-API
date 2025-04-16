import request from 'supertest';
import mongoose from 'mongoose';
import { vi } from 'vitest';

// Mock the middleware
vi.mock('../../middlewares/validationMiddleware.js', () => ({
  isAdmin: (req, res, next) => next(),
  isAdminOrSelf: (req, res, next) => next()
}));

let app;
let User;

beforeAll(async () => {
  // Load modules after mocking
  const appModule = await import('../../server.js');
  app = appModule.app;

  const userModule = await import('../../models/User.js');
  User = userModule.default;
});

describe('GET /api/users/all', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return 404 when no users exist', async () => {
    const res = await request(app).get('/api/users/all');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('No active users found');
  });

  it('should return 200 and a list of users', async () => {
    await User.create({ username: 'john', email: 'john@test.com', password: '1234' });
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
    const user = await User.create({ username: 'jane', email: 'jane@test.com', password: 'abcd' });
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.user.username).toBe('jane');
  });

  it('should return 404 if user not found', async () => {
    const res = await request(app).get(`/api/users/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('User not found');
  });
});

describe('PUT /api/users/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should update a user with valid fields', async () => {
    const user = await User.create({ username: 'old', email: 'old@test.com', password: 'pw' });
    const res = await request(app).put(`/api/users/${user._id}`).send({ username: 'new' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.user.username).toBe('new');
  });

  it('should return 400 if no update fields are provided', async () => {
    const user = await User.create({ username: 'will', email: 'will@test.com', password: 'pw' });
    const res = await request(app).put(`/api/users/${user._id}`).send({});
    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('At least one of username, email, or password is required');
  });

  it('should return 404 when updating non-existent user', async () => {
    const res = await request(app).put(`/api/users/${new mongoose.Types.ObjectId()}`).send({ username: 'ghost' });
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('User not found');
  });
});

describe('DELETE /api/users/:id', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should soft delete user', async () => {
    const user = await User.create({ username: 'temp', email: 'temp@test.com', password: 'pw' });
    const res = await request(app).delete(`/api/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.msg).toBe('User deleted successfully');
    expect(res.body.user.deleted_at).toBeDefined();
  });

  it('should return 404 when deleting non-existent user', async () => {
    const res = await request(app).delete(`/api/users/${new mongoose.Types.ObjectId()}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('error');
    expect(res.body.msg).toBe('User not found');
  });
});
