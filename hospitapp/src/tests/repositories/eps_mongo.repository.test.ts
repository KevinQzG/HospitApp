import { ObjectId } from 'mongodb';
import DBAdapter from '@/adapters/db.adapter';
import EpsRepositoryAdapter from '@/adapters/eps_repository.adapter';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';
import { Eps } from '@/models/eps';

describe('EpsMongoRepository Integration Test', () => {
    let db_handler: DBAdapter;
    let repository: EpsRepositoryAdapter;

    let results: Eps[];

    beforeAll(async () => {
        db_handler = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
        repository = _CONTAINER.get<EpsRepositoryAdapter>(_TYPES.EpsRepositoryAdapter);
        await db_handler.connect();
    });

    afterAll(async () => {
        await db_handler.close();
    });

    describe('find_all', () => {
        it('should retrieve all EPS documents', async () => {
            results = await repository.find_all();

            // Verify total count
            expect(results).toHaveLength(19);

            // Verify all items are EPS instances
            results.forEach(eps => {
                expect(eps).toBeInstanceOf(Eps);
            });
        });

        it('should return correct EPS document structure', async () => {
            results = await repository.find_all();
            const _SAMPLE_EPS = results[0];

            const _EXPECTED_DATA = {
                _id: new ObjectId("67b7885ec6dcb343450c057b"),
                name: "SALUDCOOP EPS-C",
                "01_8000_phone": "18000111896",
                fax: "6466910",
                emails: "AUTORIZACIONESENLINEA@SALUDCOOP.COOP  , DECHEVERRYO@SALUDCOOP.COOP"
            };

            expect(_SAMPLE_EPS.to_object()).toMatchObject(_EXPECTED_DATA);
        });
    });
});