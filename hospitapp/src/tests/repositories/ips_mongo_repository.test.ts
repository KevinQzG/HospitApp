import { ObjectId } from 'mongodb';
import DBInterface from '@/adapters/db_interface';
import IpsRepositoryInterface from '@/adapters/ips_repository_interface';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';

// Test constants
const _TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];
let test_specialties = ["ENFERMERÍA", "CARDIOLOGÍA"];
let test_eps_names = ["SALUDCOOP EPS-C", "ECOOPSOS EPS-S"];
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
    const { results: _RESULTS } = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      test_specialties,
      test_eps_names,
      1,
      10
    );

    expect(_RESULTS).toHaveLength(1);
    
    const _IPS = _RESULTS[0];
    expect(_IPS.getId()).toEqual(_EXPECTED_IPS_ID);
    expect(_IPS.getName()).toBe('ESE HOSPITAL VENANCIO DIAZ DIAZ');
    expect(_IPS.getDepartment()).toBe('ANTIOQUIA');
    expect(_IPS.getTown()).toBe('SABANETA');
    expect(_IPS.getDistance()).toBeCloseTo(2415.089412549286, 4);
  });

  it('should validate complete IPS document structure', async () => {
    const { results: _RESULTS } = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      test_specialties,
      test_eps_names,
      1,
      10
    );

    const [_IPS] = _RESULTS;
    const _EXPECTED_DATA = {
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

    expect(_IPS.toObject()).toMatchObject({
      ..._EXPECTED_DATA,
      distance: expect.closeTo(_EXPECTED_DATA.distance, 4)
    });
  });

  it('should validate geospatial query accuracy', async () => {
    const { results: _RESULTS } = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      test_specialties,
      test_eps_names,
      1,
      10
    );

    const [_IPS] = _RESULTS;

    // Validate coordinates precision
    expect(_IPS.getLocation().coordinates[0]).toBeCloseTo(-75.6221158, 7);
    expect(_IPS.getLocation().coordinates[1]).toBeCloseTo(6.1482081, 7);
    
    // Validate distance calculation
    expect(_IPS.getDistance()).toBeGreaterThan(2400);
    expect(_IPS.getDistance()).toBeLessThan(2500);
  });

  // New test for pagination
  it('should return correct pagination metadata', async () => {
    const _PAGE_SIZE = 1;
    const { results: _RESULTS, total: _TOTAL } = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      test_specialties,
      test_eps_names,
      1,
      _PAGE_SIZE
    );

    expect(_RESULTS).toHaveLength(_PAGE_SIZE);
    expect(_TOTAL).toBeGreaterThan(0);
    expect(_TOTAL).toBe(1);
  });

  it('should return correct data', async () => {
    test_specialties = ["ENFERMERÍA", "CARDIOLOGÍA", "CIRUGÍA DE MANO"];
    test_eps_names = [];
    const _PAGE_SIZE = 10;
    const { results: _RESULTS, total: _TOTAL } = await repository.find_all_by_distance_specialty_eps(
      _TEST_COORDINATES[0],
      _TEST_COORDINATES[1],
      _MAX_DISTANCE_METERS,
      test_specialties,
      test_eps_names,
      1,
      _PAGE_SIZE
    );

    const _IPS = _RESULTS[3];
    const _EXPECTED_DATA = {
      _id: new ObjectId("67b3e98bb1ae5d9e47ae747c"),
      name: 'CIS LA ESTRELLA CENTRAL DE SERVICIOS SUR',
      department: 'ANTIOQUIA',
      town: 'LA ESTRELLA',
      address: 'CARRERA 60 # 82 SUR - 70 LOCAL 102',
      phone: 3607080,
      email: 'NICANORBAHOQUE@COMFAMA.COM.CO',
      location: {
        type: 'Point',
        coordinates: [-75.64334029999999, 6.1559434]
      },
      distance: 2566.342006462017
    };
    console.log(_IPS.toString());

    expect(_IPS.toObject()).toMatchObject({
      ..._EXPECTED_DATA,
      distance: expect.closeTo(_EXPECTED_DATA.distance, 4)
    });

    expect(_RESULTS).toHaveLength(_PAGE_SIZE);
    expect(_TOTAL).toBeGreaterThan(0);
    expect(_TOTAL).toBe(24);
  });
});