import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, beforeEach, afterAll, vi } from 'vitest';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  vi.resetModules();
  vi.clearAllMocks();
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});
