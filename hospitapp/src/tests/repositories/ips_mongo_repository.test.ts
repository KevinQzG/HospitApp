import { ObjectId } from 'mongodb';
import DBInterface from '@/adapters/db_interface';
import IpsRepositoryInterface from '@/adapters/ips_repository_interface';
import _CONTAINER from '@/adapters/container';
import { _TYPES } from '@/adapters/types';
import { IPS } from '@/models/ips';

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

  describe('find_all_by_distance_specialty_eps', () => {
    const _TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];
    let test_specialties = ["ENFERMERÍA", "CARDIOLOGÍA"];
    let test_eps_names = ["SALUDCOOP EPS-C", "ECOOPSOS EPS-S"];
    const _MAX_DISTANCE_METERS = 5000; // 5km
    const _EXPECTED_IPS_ID = new ObjectId("67b3e98bb1ae5d9e47ae7a07");

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

      expect(_IPS.toObject()).toMatchObject({
        ..._EXPECTED_DATA,
        distance: expect.closeTo(_EXPECTED_DATA.distance, 4)
      });

      expect(_RESULTS).toHaveLength(_PAGE_SIZE);
      expect(_TOTAL).toBeGreaterThan(0);
      expect(_TOTAL).toBe(24);
    });
  });

  describe('find_by_id', () => {
    const _EXPECTED_IPS_ID = "67b3e98bb1ae5d9e47ae72a8";
    let ips: IPS | null;

    it('should retrieve exactly one matching IPS with correct data', async () => {
      ips = await repository.find_by_id(_EXPECTED_IPS_ID);

      expect(ips?.getId()).toEqual(new ObjectId(_EXPECTED_IPS_ID));
      expect(ips?.getName()).toBe('INSTITUTO DEL CORAZON SEDE CENTRO');
      expect(ips?.getDepartment()).toBe('ANTIOQUIA');
      expect(ips?.getTown()).toBe('MEDELLÍN');
    });

    it('should validate complete IPS document structure', async () => {
      ips = await repository.find_by_id(_EXPECTED_IPS_ID);

      const _EXPECTED_DATA = {
        _id: new ObjectId(_EXPECTED_IPS_ID),
        name: 'INSTITUTO DEL CORAZON SEDE CENTRO',
        department: 'ANTIOQUIA',
        town: 'MEDELLÍN',
        address: 'CALLE 54 # 49-69',
        phone: 3207240,
        email: 'CALIDAD@INSTITUTODELCORAZON.ORG.CO',
        location: {
          type: 'Point',
          coordinates: [-75.5656501, 6.252574]
        },
        eps: [
          {
            _id: new ObjectId("67b7885ec6dcb343450c057a"),
            name: "COOMEVA EPS-C",
            "01_8000_phone": "18000942404",
            fax: "6044545 OPCION 1",
            emails: "<CLARAI_PELAEZ@COOMEVA.COM.CO>, <PAULOA_GIRALDO@COOMEVA.COM.CO>, JAZMINJ_MEZA@COOMEVA.COM.CO"
          },
          {
            _id: new ObjectId("67b7885ec6dcb343450c057f"),
            name: "FUNDACION MEDICO PREVENTIVA EPS-C",
            "01_8000_phone": "18000111080",
            fax: "2160054",
            emails: "CENTROREGULADORANT@FUNDAMEP.COM"
          }
        ],
        specialties: [
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae721a"),
            "name": "DIAGNÓSTICO VASCULAR",
            "schedule_monday": "07:00A17:00",
            "schedule_tuesday": "07:00A17:00",
            "schedule_wednesday": "07:00A17:00",
            "schedule_thursday": "07:00A17:00",
            "schedule_friday": "07:00A17:00",
            "schedule_saturday": "07:00A13:00",
            "schedule_sunday": "07:00A13:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae721c"),
            "name": "TERAPIA RESPIRATORIA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae721f"),
            "name": "TOMA DE MUESTRAS DE LABORATORIO CLÍNICO",
            "schedule_monday": "06:00A14:00",
            "schedule_tuesday": "06:00A14:00",
            "schedule_wednesday": "06:00A14:00",
            "schedule_thursday": "06:00A14:00",
            "schedule_friday": "06:00A14:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7222"),
            "name": "ENDOCRINOLOGÍA"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7223"),
            "name": "CARDIOLOGÍA"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7224"),
            "name": "ENFERMERÍA",
            "schedule_monday": "06:00A19:00",
            "schedule_tuesday": "06:00A19:00",
            "schedule_wednesday": "06:00A19:00",
            "schedule_thursday": "06:00A19:00",
            "schedule_friday": "06:00A19:00",
            "schedule_saturday": "06:00A19:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7225"),
            "name": "MEDICINA GENERAL"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7226"),
            "name": "GINECOBSTETRICIA",
            "schedule_monday": "07:00A18:00",
            "schedule_tuesday": "07:00A18:00",
            "schedule_wednesday": "07:00A18:00",
            "schedule_thursday": "07:00A18:00",
            "schedule_friday": "07:00A18:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7227"),
            "name": "MEDICINA INTERNA"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7228"),
            "name": "NUTRICIÓN Y DIETÉTICA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae7229"),
            "name": "PSICOLOGÍA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00"
          },
          {
            "_id": new ObjectId("67b3e928b1ae5d9e47ae722b"),
            "name": "NEUROLOGÍA",
            "schedule_tuesday": "08:00A17:00",
            "schedule_wednesday": "08:00A17:00"
          }
        ]

      };

      expect(ips?.toObject()).toMatchObject(_EXPECTED_DATA);
    });

  });

});
