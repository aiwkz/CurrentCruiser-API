import request from 'supertest';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';

import type { Application, Request, Response, NextFunction } from 'express';
import type { Model } from 'mongoose';

import type { IUser } from '../../models/User.ts';

vi.mock('../middlewares/validationMiddleware.ts', () => ({
  isAdmin: (_req: Request, _res: Response, _next: NextFunction) => _next(),
  isAdminOrSelf: (_req: Request, _res: Response, _next: NextFunction) => _next(),
}));

let app: Application;
let User: Model<IUser>;

beforeAll(async () => {
  const appModule = await import('../../server.ts');
  app = appModule.app;

  const userModule = await import('../../models/User.ts');
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

      expect(res.statusCode).toBe(201);
      expect(res.body.status).toBe('ok');
      expect(res.body.user.username).toBe('testuser');
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
