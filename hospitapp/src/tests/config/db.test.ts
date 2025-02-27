import MongoDB from '@/config/db';
import { ObjectId } from 'mongodb';


describe('MongoDB Connection Test', () => {
  // Necessary Data to Test the Connection to the Database
  const _FILTER = { _id: new ObjectId('67b7885ec6dcb343450c0582') };
  const _EXPECTED_RESULT = [{ _id: new ObjectId('67b7885ec6dcb343450c0582'), name: "COMFAMILIARCAMACOL EPS-S", "01_8000_phone": "018000 111776", fax: "2609442", emails: "REFERENCIA@COMFAMILIARCAMACOL.COM"}];

  // After all tests are done, close the connection to the database
  afterAll(async () => {
    await MongoDB.close();
  });

  // Test the connection to the database
  it('should find a document', async () => {
    // Connect to the database
    const _DB = await MongoDB.connect();
    // Find a document in the 'EPS' collection and compare the result with the expected result
    const _RESULT = await _DB.collection('EPS').find(_FILTER).toArray();
    expect(_RESULT).toEqual(_EXPECTED_RESULT);
  });
});