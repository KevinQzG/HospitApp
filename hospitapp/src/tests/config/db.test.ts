import MongoDB from '@/config/db';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('MongoDB Connection', () => {
  let mongoServer: MongoMemoryServer;

  // Increase timeout to 30 seconds for all hooks and tests
  jest.setTimeout(30000);

  beforeAll(async () => {
    try {
      mongoServer = await MongoMemoryServer.create();
      process.env.DATABASE_URL = mongoServer.getUri();
    } catch (err) {
      console.error('Failed to start MongoDB Memory Server:', err);
      throw err;
    }
  });

  afterAll(async () => {
    if (mongoServer) {
      await mongoServer.stop();
    }
    await MongoDB.close();
  });

  it('should connect to the database', async () => {
    const db = await MongoDB.connect();
    expect(db).toBeDefined();
  });

  it('should reuse the existing connection', async () => {
    const db1 = await MongoDB.connect();
    const db2 = await MongoDB.connect();
    expect(db1).toBe(db2); // Both should reference the same connection
  });

  it('should close the connection', async () => {
    await MongoDB.close();
    const db = await MongoDB.connect(); // Reconnect to ensure the connection was closed
    expect(db).toBeDefined();
  });
});