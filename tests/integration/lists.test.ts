import request from 'supertest';
import mongoose from 'mongoose';
import { vi, describe, it, expect, beforeAll, beforeEach } from 'vitest';
import type { Application, Request, Response, NextFunction } from 'express';
import type { Model } from 'mongoose';
import type { IList } from '@models/List.ts';

vi.mock('@middlewares/auth.ts', () => ({
  auth: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

vi.mock('@middlewares/validationMiddleware.ts', () => ({
  isAdmin: (_req: Request, _res: Response, next: NextFunction) => next(),
  isAdminOrSelf: (_req: Request, _res: Response, next: NextFunction) => next(),
}));

let app: Application;
let List: Model<IList>;

beforeAll(async () => {
  const appModule = await import('server.ts');
  const listModule = await import('@models/List.ts');
  app = appModule.app;
  List = listModule.default;
});

describe('List Routes', () => {
  beforeEach(async () => {
    await List.deleteMany({});
  });

  describe('POST /api/lists/create', () => {
    it('should create a list with valid input', async () => {
      const res = await request(app).post('/api/lists/create').send({
        title: 'My Car List',
        user_id: new mongoose.Types.ObjectId(),
        cars: [],
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.list.title).toBe('My Car List');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(app).post('/api/lists/create').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/lists/all', () => {
    it('should return 404 when no lists exist', async () => {
      const res = await request(app).get('/api/lists/all');
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });

    it('should return 200 and list of lists', async () => {
      await List.create({ title: 'My List', user_id: new mongoose.Types.ObjectId() });
      const res = await request(app).get('/api/lists/all');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.lists)).toBe(true);
    });
  });

  describe('GET /api/lists/:id', () => {
    it('should return a list by ID', async () => {
      const list = await List.create({ title: 'Target List', user_id: new mongoose.Types.ObjectId() });
      const res = await request(app).get(`/api/lists/${list._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.list.title).toBe('Target List');
    });

    it('should return 404 for invalid ID', async () => {
      const res = await request(app).get(`/api/lists/${new mongoose.Types.ObjectId()}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/lists/user/:userId', () => {
    it('should return lists for a user', async () => {
      const userId = new mongoose.Types.ObjectId();
      await List.create({ title: 'User List', user_id: userId });
      const res = await request(app).get(`/api/lists/user/${userId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(Array.isArray(res.body.lists)).toBe(true);
      expect(res.body.lists.length).toBeGreaterThan(0);
    });

    it('should return 404 if user has no lists', async () => {
      const res = await request(app).get(`/api/lists/user/${new mongoose.Types.ObjectId()}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('PUT /api/lists/:id', () => {
    it('should update a list title', async () => {
      const list = await List.create({ title: 'Old Title', user_id: new mongoose.Types.ObjectId() });
      const res = await request(app).put(`/api/lists/${list._id}`).send({ title: 'New Title' });
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.list.title).toBe('New Title');
    });

    it('should return 404 when updating non-existent list', async () => {
      const res = await request(app).put(`/api/lists/${new mongoose.Types.ObjectId()}`).send({ title: 'Ghost' });
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });

  describe('DELETE /api/lists/:id', () => {
    it('should soft delete a list', async () => {
      const list = await List.create({ title: 'To Delete', user_id: new mongoose.Types.ObjectId() });
      const res = await request(app).delete(`/api/lists/${list._id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.msg).toMatch(/deleted/i);
      expect(res.body.list.deleted_at).toBeDefined();
    });

    it('should return 404 when deleting non-existent list', async () => {
      const res = await request(app).delete(`/api/lists/${new mongoose.Types.ObjectId()}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('error');
    });
  });
});
