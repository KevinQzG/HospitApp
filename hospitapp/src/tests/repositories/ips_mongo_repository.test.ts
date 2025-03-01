import { ObjectId } from 'mongodb';
import DBInterface from '@/adapters/db_interface';
import IpsRepositoryInterface from '@/adapters/ips_repository_interface';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';

// Test constants
const _TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];
const _TEST_SPECIALTIES = ["ENFERMERÍA", "CARDIOLOGÍA"];
const _TEST_EPS_NAMES = ["SALUDCOOP EPS-C", "ECOOPSOS EPS-S"];
const _MAX_DISTANCE_METERS = 5000; // 5km
const _EXPECTED_IPS_ID = new ObjectId("67b3e98bb1ae5d9e47ae7a07");

describe('IpsMongoRepository Integration Test', () => {
  let db_handler: DBInterface;
  let repository: IpsRepositoryInterface;

  beforeAll(async () => {
    // Initialize dependencies from container
    db_handler = _CONTAINER.get<DBInterface>(_TYPES.DBInterface);
    repository = _CONTAINER.get<IpsRepositoryInterface>(_TYPES.IpsRepositoryInterface);
    
    // Establish database connection
    await db_handler.connect();
  });

  afterAll(async () => {
    await db_handler.close();
  });

  it('should retrieve exactly one matching IPS with correct data', async () => {
    const results = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      _TEST_SPECIALTIES,
      _TEST_EPS_NAMES
    );

    expect(results).toHaveLength(1);
    
    const ips = results[0];
    expect(ips.getId()).toEqual(_EXPECTED_IPS_ID);
    expect(ips.getName()).toBe('ESE HOSPITAL VENANCIO DIAZ DIAZ');
    expect(ips.getDepartment()).toBe('ANTIOQUIA');
    expect(ips.getTown()).toBe('SABANETA');
    expect(ips.getDistance()).toBeCloseTo(2415.089412549286, 4);
  });

  it('should validate complete IPS document structure', async () => {
    const [ips] = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      _TEST_SPECIALTIES,
      _TEST_EPS_NAMES
    );

    const expected_data = {
      _id: _EXPECTED_IPS_ID,
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

    expect(ips.toObject()).toMatchObject({
      ...expected_data,
      distance: expect.closeTo(expected_data.distance, 4)
    });
  });

  it('should validate geospatial query accuracy', async () => {
    const [ips] = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      _TEST_SPECIALTIES,
      _TEST_EPS_NAMES
    );

    // Validate coordinates precision
    expect(ips.getLocation().coordinates[0]).toBeCloseTo(-75.6221158, 7);
    expect(ips.getLocation().coordinates[1]).toBeCloseTo(6.1482081, 7);
    
    // Validate distance calculation
    expect(ips.getDistance()).toBeGreaterThan(2400);
    expect(ips.getDistance()).toBeLessThan(2500);
  });
});