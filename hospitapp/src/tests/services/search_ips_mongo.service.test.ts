import { Container } from 'inversify';
import { _TYPES } from '@/adapters/types';
import { SearchIpsMongoService } from '@/services/search_ips/search_ips_mongo.service';
import type SearchIpsServiceAdapter from '@/adapters/search_ips.service.adapter';
import type IpsRepositoryAdapter from '@/adapters/ips_repository.adapter';
import type SpecialtyRepositoryAdapter from '@/adapters/specialty_repository.adapter';
import type EPSRepositoryAdapter from '@/adapters/eps_repository.adapter';
import { IpsResponse } from '@/models/ips.interface';

describe('SearchIpsMongoService Integration Test', () => {
    const _CONTAINER = new Container();
    let service: SearchIpsMongoService;
    let mock_ips_repository: jest.Mocked<IpsRepositoryAdapter>;
    let mock_specialty_repository: jest.Mocked<SpecialtyRepositoryAdapter>;
    let mock_eps_repository: jest.Mocked<EPSRepositoryAdapter>;

    const _TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];

    const _MOCK_IPS_RES: IpsResponse = {
        _id: "67b3e98bb1ae5d9e47ae7a07",
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
        mock_ips_repository = {
            find_all_by_distance_specialty_eps: jest.fn().mockResolvedValue({
                results: [{
                    to_response: () => _MOCK_IPS_RES
                }],
                total: 1
            }),
            find_by_name: jest.fn().mockResolvedValue({
                to_response: () => _MOCK_IPS_RES
            })
        };

        mock_specialty_repository = {
            find_all: jest.fn().mockResolvedValue([{
                to_response: () => ({
                    _id: "67b3e98bb1ae5d9e47ae7a08",
                    name: 'ENFERMERÍA',
                })
            }])
        };

        mock_eps_repository = {
            find_all: jest.fn().mockResolvedValue([{
                to_response: () => ({
                    _id: "67b3e98bb1ae5d9e47ae7a09",
                    name: 'SALUD TOTAL',
                })
            }])
        };

        // Rebind repository for testing
        _CONTAINER.bind<IpsRepositoryAdapter>(_TYPES.IpsRepositoryAdapter)
            .toConstantValue(mock_ips_repository);
        _CONTAINER.bind<SpecialtyRepositoryAdapter>(_TYPES.SpecialtyRepositoryAdapter)
            .toConstantValue(mock_specialty_repository);
        _CONTAINER.bind<EPSRepositoryAdapter>(_TYPES.EpsRepositoryAdapter)
            .toConstantValue(mock_eps_repository);
        _CONTAINER.bind<SearchIpsServiceAdapter>(_TYPES.SearchIpsServiceAdapter).to(SearchIpsMongoService)

        service = _CONTAINER.get<SearchIpsMongoService>(_TYPES.SearchIpsServiceAdapter);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('filter', () => {
        it('should correctly delegate to repository and return documents', async () => {
            const { results: _RESULTS, total: _TOTAL } = await service.filter_ips(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify repository call
            expect(mock_ips_repository.find_all_by_distance_specialty_eps).toHaveBeenCalledWith(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                ["ENFERMERÍA"],
                ["SALUDCOOP EPS-C"],
                1,
                10
            );

            // Verify output transformation
            expect(_RESULTS).toEqual([_MOCK_IPS_RES]);
            expect(_TOTAL).toBe(1);
        });

        it('should convert all results to IPSDocument format', async () => {
            const { results: _RESULTS } = await service.filter_ips(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                [],
                [],
                1,
                10
            );

            _RESULTS.forEach(doc => {
                expect(doc).toMatchObject({
                    _id: expect.any(String),
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
            const { total: _TOTAL } = await service.filter_ips(
                _TEST_COORDINATES[0],
                _TEST_COORDINATES[1],
                5000,
                [],
                [],
                2,
                5
            );

            expect(mock_ips_repository.find_all_by_distance_specialty_eps).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                2,
                5
            );
            expect(_TOTAL).toBe(1);
        });

        it('should handle repository errors', async () => {
            mock_ips_repository.find_all_by_distance_specialty_eps.mockRejectedValueOnce(new Error('DB error'));

            await expect(service.filter_ips(
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

    describe('get_specialties', () => {
        it('should retrieve and transform all specialties', async () => {
            const _SPECIALTIES = await service.get_all_specialties();

            expect(mock_specialty_repository.find_all).toHaveBeenCalled();
            expect(_SPECIALTIES).toEqual([{
                _id: "67b3e98bb1ae5d9e47ae7a08",
                name: 'ENFERMERÍA',
            }]);
        });

        it('should handle empty specialty list', async () => {
            mock_specialty_repository.find_all.mockResolvedValueOnce([]);
            const _SPECIALTIES = await service.get_all_specialties();

            expect(_SPECIALTIES).toEqual([]);
        });

        it('should handle repository errors', async () => {
            mock_specialty_repository.find_all.mockRejectedValueOnce(new Error('Specialty DB error'));
            await expect(service.get_all_specialties()).rejects.toThrow('Specialty DB error');
        });
    });

    describe('get_eps', () => {
        it('should retrieve and transform all EPS entries', async () => {
            const _EPS_LIST = await service.get_all_eps();

            expect(mock_eps_repository.find_all).toHaveBeenCalled();
            expect(_EPS_LIST).toEqual([{
                _id: "67b3e98bb1ae5d9e47ae7a09",
                name: 'SALUD TOTAL',
            }]);
        });

        it('should handle empty EPS list', async () => {
            mock_eps_repository.find_all.mockResolvedValueOnce([]);
            const _EPS_LIST = await service.get_all_eps();

            expect(_EPS_LIST).toEqual([]);
        });

        it('should handle repository errors', async () => {
            mock_eps_repository.find_all.mockRejectedValueOnce(new Error('EPS DB error'));
            await expect(service.get_all_eps()).rejects.toThrow('EPS DB error');
        });
    });
    
    describe('get_ips_by_name', () => {
        it('should retrieve IPS by ID and return transformed response', async () => {
            const _NAME = 'ESE HOSPITAL VENANCIO DIAZ DIAZ';
            const _RESULT = await service.get_ips_by_name(_NAME);

            expect(mock_ips_repository.find_by_name).toHaveBeenCalledWith(_NAME);
            expect(_RESULT).toEqual(_MOCK_IPS_RES);
        });

        it('should return null if IPS is not found', async () => {
            const _NAME = 'non_existent_name';
            mock_ips_repository.find_by_name.mockResolvedValueOnce(null);

            const _RESULT = await service.get_ips_by_name(_NAME);

            expect(mock_ips_repository.find_by_name).toHaveBeenCalledWith(_NAME);
            expect(_RESULT).toBeNull();
        });

        it('should handle repository errors', async () => {
            const _NAME = 'error_name';
            const _ERROR = new Error('DB error');
            mock_ips_repository.find_by_name.mockRejectedValueOnce(_ERROR);

            await expect(service.get_ips_by_name(_NAME)).rejects.toThrow(_ERROR);
        });
    });
});