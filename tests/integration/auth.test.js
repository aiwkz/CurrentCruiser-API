import request from 'supertest';
import { vi } from 'vitest';

// Mock middlewares
vi.mock('../../middlewares/validationMiddleware.js', () => ({
  isAdmin: (req, res, next) => next(),
  isAdminOrSelf: (req, res, next) => next(),
}));

let app;
let User;

beforeAll(async () => {
  const appModule = await import('../../server.js');
  app = appModule.app;

  const userModule = await import('../../models/User.js');
  User = userModule.default;
});

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a user with valid data', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.user.username).toBe('testuser');
    });

    it('should return 400 for missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'mypassword',
      });
    });

    it('should login with correct credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'mypassword',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.token).toBeDefined();
    });

    it('should return 401 with wrong credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@example.com',
        password: 'wrongpassword',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body.status).toBe('error');
    });
  });
});
