import { ObjectId } from 'mongodb';
import DBAdapter from '@/adapters/db.adapter';
import SpecialtyRepositoryAdapter from '@/adapters/specialty_repository.adapter';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';
import { Specialty } from '@/models/specialty';

describe('SpecialtyMongoRepository Integration Test', () => {
    let db_handler: DBAdapter;
    let repository: SpecialtyRepositoryAdapter;

    let results: Specialty[];

    beforeAll(async () => {
        db_handler = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
        repository = _CONTAINER.get<SpecialtyRepositoryAdapter>(_TYPES.SpecialtyRepositoryAdapter);
        await db_handler.connect();
    });

    afterAll(async () => {
        await db_handler.close();
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
            const _SAMPLE_EPS = results[0];

            const _EXPECTED_DATA = {
                _id: new ObjectId("67b3e928b1ae5d9e47ae7224"),
                name: "ENFERMERÍA",
            };

            expect(_SAMPLE_EPS.toObject()).toMatchObject(_EXPECTED_DATA);
        });
    });
});