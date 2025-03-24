import { ObjectId } from 'mongodb';
import DBAdapter from '@/adapters/db.adapter';
import SpecialtyRepositoryAdapter from '@/adapters/specialty_repository.adapter';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';
import { Specialty } from '@/models/specialty';

describe('SpecialtyMongoRepository Integration Test', () => {
    let dbHandler: DBAdapter;
    let repository: SpecialtyRepositoryAdapter;

    let results: Specialty[];

    beforeAll(async () => {
        dbHandler = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
        repository = _CONTAINER.get<SpecialtyRepositoryAdapter>(_TYPES.SpecialtyRepositoryAdapter);
        await dbHandler.connect();
    });

    afterAll(async () => {
        await dbHandler.close();
    });

    describe('find_all', () => {
        it('should retrieve all Specialty documents', async () => {
            results = await repository.find_all();

            // Verify total count
            expect(results).toHaveLength(138);

            // Verify all items are EPS instances
            results.forEach(eps => {
                expect(eps).toBeInstanceOf(Specialty);
            });
        });

        it('should return correct EPS document structure', async () => {
            results = await repository.find_all();
            const sampleEps = results[0];

            const expectedData = {
                _id: new ObjectId("67b3e928b1ae5d9e47ae7224"),
                name: "ENFERMERÍA",
            };

            expect(sampleEps.to_object()).toMatchObject(expectedData);
        });
    });
});
