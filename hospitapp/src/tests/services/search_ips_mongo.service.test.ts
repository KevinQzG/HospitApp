import { Container } from 'inversify';
import { ObjectId } from 'mongodb';
import { _TYPES } from '@/adapters/types';
import { SearchIpsMongoService } from '@/services/search_ips_mongo.service';
import type SearchIpsServiceAdapter from '@/adapters/search_ips.service.adapter';
import type IpsRepositoryAdapter from '@/adapters/ips_repository.adapter';
import { IPSDocument } from '@/models/ips.interface';

describe('SearchIpsMongoService Integration Test', () => {
    const _CONTAINER = new Container();
    let service: SearchIpsMongoService;
    let mockRepository: jest.Mocked<IpsRepositoryAdapter>;

    const _TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];
    const _MOCK_IPS_DOC: IPSDocument = {
        _id: new ObjectId("67b3e98bb1ae5d9e47ae7a07"),
        name: 'ESE HOSPITAL VENANCIO DIAZ DIAZ',
        department: 'ANTIOQUIA',
        town: 'SABANETA',
        address: 'KR 46B # 77 SUR 36',
        phone: 2889701,
        email: 'GERENCIA@HOSPITALSABANETA.GOV.CO',
        location: {
            type: 'Point',
            coordinates: [-75.6221158, 6.1482081]
        },
        level: 1,
        distance: 2415.089412549286
    };

    beforeAll(() => {
        // Create mock repository
        mockRepository = {
            find_all_by_distance_specialty_eps: jest.fn().mockResolvedValue({
                results: [{
                    toObject: () => _MOCK_IPS_DOC
                }],
                total: 1
            }),
            find_by_id: jest.fn().mockResolvedValue(_MOCK_IPS_DOC)
        };

        // Rebind repository for testing
        _CONTAINER.bind<IpsRepositoryAdapter>(_TYPES.IpsRepositoryAdapter)
            .toConstantValue(mockRepository);
        _CONTAINER.bind<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter).to(SearchIpsMongoService)

        service = _CONTAINER.get<SearchIpsMongoService>(_TYPES.SearchIpsServiceAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('filter', () => {
        it('should correctly delegate to repository and return documents', async () => {
            const { results, total } = await service.filter(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify repository call
            expect(mockRepository.find_all_by_distance_specialty_eps).toHaveBeenCalledWith(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify output transformation
            expect(results).toEqual([_MOCK_IPS_DOC]);
            expect(total).toBe(1);
        });

        it('should convert all results to IPSDocument format', async () => {
            const { results } = await service.filter(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                [],
                [],
                1,
                10
            );

            results.forEach(doc => {
                expect(doc).toMatchObject({
                    _id: expect.any(ObjectId),
                    name: expect.any(String),
                    department: expect.any(String),
                    location: {
                        type: 'Point',
                        coordinates: expect.any(Array)
                    }
                });
            });
        });

        it('should handle pagination parameters correctly', async () => {
            const { total } = await service.filter(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                [],
                [],
                2,
                5
            );

            expect(mockRepository.find_all_by_distance_specialty_eps).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                2,
                5
            );
            expect(total).toBe(1);
        });

        it('should handle repository errors', async () => {
            mockRepository.find_all_by_distance_specialty_eps.mockRejectedValueOnce(new Error('DB error'));

            await expect(service.filter(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                [],
                [],
                1,
                10
            )).rejects.toThrow('DB error');
        });
    });
});