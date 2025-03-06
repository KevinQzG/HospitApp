import MongoDB from '@/config/mongo_db';
import { ObjectId } from 'mongodb';
import _container from '@/adapters/container'; // Import your Inversify container
import { _TYPES } from '@/adapters/types'; // Import your dependency injection symbols

describe('MongoDB Singleton Test', () => {
  const _FILTER = { _id: new ObjectId('67b7885ec6dcb343450c0582') };
  const _EXPECTED_RESULT = [{ _id: new ObjectId('67b7885ec6dcb343450c0582'), name: "COMFAMILIARCAMACOL EPS-S", "01_8000_phone": "018000 111776", fax: "2609442", emails: "REFERENCIA@COMFAMILIARCAMACOL.COM"}];

  let mongo_client_1: MongoDB;
  let mongo_client_2: MongoDB;

  beforeAll(() => {
    // Get instances through the container
    mongo_client_1 = _container.get<MongoDB>(_TYPES.DBAdapter);
    mongo_client_2 = _container.get<MongoDB>(_TYPES.DBAdapter);
  });

  afterAll(async () => {
    await mongo_client_1.close();
  });

  it('should return the same instance through container', () => {
    expect(mongo_client_1).toBe(mongo_client_2); // Strict equality check
  });

  it('should maintain single connection instance', async () => {
    const _DB1 = await mongo_client_1.connect();
    const _DB2 = await mongo_client_2.connect();
    
    expect(_DB1).toBe(_DB2); // Both should reference the same DB instance
  });

  it('should handle multiple connect calls efficiently', async () => {
    const _INITIAL_CONNECTION = await mongo_client_1.connect();
    const _SECOND_CONNECTION = await mongo_client_1.connect();
    
    expect(_SECOND_CONNECTION).toBe(_INITIAL_CONNECTION); // Same instance
  });

  it('should find a document', async () => {
    const _DB = await mongo_client_1.connect();
    const _RESULT = await _DB.collection('EPS').find(_FILTER).toArray();
    expect(_RESULT).toEqual(_EXPECTED_RESULT);
  });
});