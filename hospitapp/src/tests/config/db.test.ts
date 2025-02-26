import MongoDB from '@/config/db';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { ObjectId } from 'mongodb';

describe('MongoDB Connection', () => {
  let mongoServer: MongoMemoryServer;
  const _FILTER = { _id: new ObjectId('67b7885ec6dcb343450c0582') };
  const _EXPECTED_RESULT = [{ _id: new ObjectId('67b7885ec6dcb343450c0582'), name: "COMFAMILIARCAMACOL EPS-S", "01_8000_phone": "018000 111776", fax: "2609442", emails: "REFERENCIA@COMFAMILIARCAMACOL.COM"}];

  // Increase timeout to 30 seconds for all hooks and tests
  jest.setTimeout(30000);

  beforeAll(async () => {
    try {
      // Start MongoDB Memory Server
      mongoServer = await MongoMemoryServer.create();
      process.env.DATABASE_URL = mongoServer.getUri();
      process.env.DATABASE_NAME = 'HospitAppDev';
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

  it('should find a document', async () => {
    const db = await MongoDB.connect();
    const result = await db.collection('EPS').find(_FILTER).toArray();
    expect(result).toEqual(_EXPECTED_RESULT);
  });
});