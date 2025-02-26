import MongoDB from '@/config/db';
import { ObjectId } from 'mongodb';

describe('MongoDB Connection', () => {
  const _FILTER = { _id: new ObjectId('67b7885ec6dcb343450c0582') };
  const _EXPECTED_RESULT = [{ _id: new ObjectId('67b7885ec6dcb343450c0582'), name: "COMFAMILIARCAMACOL EPS-S", "01_8000_phone": "018000 111776", fax: "2609442", emails: "REFERENCIA@COMFAMILIARCAMACOL.COM"}];

  // Increase timeout to 30 seconds for all hooks and tests
  jest.setTimeout(30000);

  afterAll(async () => {
    await MongoDB.close();
  });

  it('should find a document', async () => {
    const _DB = await MongoDB.connect();
    const _RESULT = await _DB.collection('EPS').find(_FILTER).toArray();
    expect(_RESULT).toEqual(_EXPECTED_RESULT);
  });
});