import DBAdapter from "@/adapters/db.adapter";
import IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { Ips } from "@/models/ips";

describe("IpsMongoRepository Integration Test", () => {
  let dbHandler: DBAdapter;
  let repository: IpsRepositoryAdapter;

  beforeAll(async () => {
    // Initialize dependencies from container
    dbHandler = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
    repository = CONTAINER.get<IpsRepositoryAdapter>(
      TYPES.IpsRepositoryAdapter
    );

    // Establish database connection
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.close();
  });

  describe("find_all_by_distance_specialty_eps", () => {
    const TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];
    let testSpecialties = ["ENFERMERÍA", "CARDIOLOGÍA"];
    let testEpsNames = ["SALUDCOOP EPS-C", "ECOOPSOS EPS-S"];
    const MAX_DISTANCE_METERS = 5000; // 5km
    const EXPECTED_IPS_ID = "67b3e98bb1ae5d9e47ae7a07";

    it("should retrieve the all the IPS that matches without the coordinates", async () => {
      const { results: RESULTS, total: TOTAL } =
        await repository.findAllByDistanceSpecialtyEps(
          null,
          null,
          null,
          testSpecialties,
          testEpsNames,
          1,
          10
        );

      expect(RESULTS).toHaveLength(10);
      expect(TOTAL).toBeGreaterThan(0);
      expect(TOTAL).toBe(110);
    });

    it("should retrieve exactly one matching IPS with correct data", async () => {
      const { results: RESULTS } =
        await repository.findAllByDistanceSpecialtyEps(
          TEST_COORDINATES[0],
          TEST_COORDINATES[1],
          MAX_DISTANCE_METERS,
          testSpecialties,
          testEpsNames,
          1,
          10
        );

      expect(RESULTS).toHaveLength(1);

      const IPS = RESULTS[0];
      expect(IPS.getId().toString()).toEqual(EXPECTED_IPS_ID);
      expect(IPS.getName()).toBe("ESE HOSPITAL VENANCIO DIAZ DIAZ");
      expect(IPS.getDepartment()).toBe("ANTIOQUIA");
      expect(IPS.getTown()).toBe("SABANETA");
      expect(IPS.getDistance()).toBeCloseTo(2415.089412549286, 4);
    });

    it("should validate complete IPS document structure", async () => {
      const { results: RESULTS } =
        await repository.findAllByDistanceSpecialtyEps(
          TEST_COORDINATES[0],
          TEST_COORDINATES[1],
          MAX_DISTANCE_METERS,
          testSpecialties,
          testEpsNames,
          1,
          10
        );

      const [IPS] = RESULTS;
      const EXPECTED_DATA = {
        _id: EXPECTED_IPS_ID,
        name: "ESE HOSPITAL VENANCIO DIAZ DIAZ",
        department: "ANTIOQUIA",
        town: "SABANETA",
        address: "KR 46B # 77 SUR 36",
        phone: 2889701,
        email: "GERENCIA@HOSPITALSABANETA.GOV.CO",
        location: {
          type: "Point",
          coordinates: [-75.6221158, 6.1482081],
        },
        level: 1,
        distance: 2415.089412549286,
      };

      expect(IPS.toResponse()).toMatchObject({
        ...EXPECTED_DATA,
        distance: expect.closeTo(EXPECTED_DATA.distance, 4),
      });
    });

    it("should validate geospatial query accuracy", async () => {
      const { results: RESULTS } =
        await repository.findAllByDistanceSpecialtyEps(
          TEST_COORDINATES[0],
          TEST_COORDINATES[1],
          MAX_DISTANCE_METERS,
          testSpecialties,
          testEpsNames,
          1,
          10
        );

      const [IPS] = RESULTS;

      // Validate coordinates precision
      expect(IPS.getLocation().coordinates[0]).toBeCloseTo(-75.6221158, 7);
      expect(IPS.getLocation().coordinates[1]).toBeCloseTo(6.1482081, 7);

      // Validate distance calculation
      expect(IPS.getDistance()).toBeGreaterThan(2400);
      expect(IPS.getDistance()).toBeLessThan(2500);
    });

    // New test for pagination
    it("should return correct pagination metadata", async () => {
      const PAGE_SIZE = 1;
      const { results: RESULTS, total: TOTAL } =
        await repository.findAllByDistanceSpecialtyEps(
          TEST_COORDINATES[0],
          TEST_COORDINATES[1],
          MAX_DISTANCE_METERS,
          testSpecialties,
          testEpsNames,
          1,
          PAGE_SIZE
        );

      expect(RESULTS).toHaveLength(PAGE_SIZE);
      expect(TOTAL).toBeGreaterThan(0);
      expect(TOTAL).toBe(1);
    });

    it("should return correct data", async () => {
      testSpecialties = ["ENFERMERÍA", "CARDIOLOGÍA", "CIRUGÍA DE MANO"];
      testEpsNames = [];
      const PAGE_SIZE = 10;
      const { results: RESULTS, total: TOTAL } =
        await repository.findAllByDistanceSpecialtyEps(
          TEST_COORDINATES[0],
          TEST_COORDINATES[1],
          MAX_DISTANCE_METERS,
          testSpecialties,
          testEpsNames,
          1,
          PAGE_SIZE
        );

      const IPS = RESULTS[3];
      const EXPECTED_DATA = {
        _id: "67b3e98bb1ae5d9e47ae747c",
        name: "CIS LA ESTRELLA CENTRAL DE SERVICIOS SUR",
        department: "ANTIOQUIA",
        town: "LA ESTRELLA",
        address: "CARRERA 60 # 82 SUR - 70 LOCAL 102",
        phone: 3607080,
        email: "NICANORBAHOQUE@COMFAMA.COM.CO",
        location: {
          type: "Point",
          coordinates: [-75.64334029999999, 6.1559434],
        },
        distance: 2566.342006462017,
      };

      expect(IPS.toResponse()).toMatchObject({
        ...EXPECTED_DATA,
        distance: expect.closeTo(EXPECTED_DATA.distance, 4),
      });

      expect(RESULTS).toHaveLength(PAGE_SIZE);
      expect(TOTAL).toBeGreaterThan(0);
      expect(TOTAL).toBe(24);
    });
  });

  describe("find_by_name", () => {
    const EXPECTED_IPS_NAME = "INSTITUTO DEL CORAZON SEDE CENTRO";
    let ips: Ips | null;

    it("should retrieve exactly one matching IPS with correct data", async () => {
      ips = await repository.findByName(EXPECTED_IPS_NAME);

      expect(ips?.getName()).toBe(EXPECTED_IPS_NAME);
      expect(ips?.getDepartment()).toBe("ANTIOQUIA");
      expect(ips?.getTown()).toBe("MEDELLÍN");
    });

    it("should validate complete IPS document structure", async () => {
      ips = await repository.findByName(EXPECTED_IPS_NAME);

      const EXPECTED_DATA = {
        _id: "67b3e98bb1ae5d9e47ae72a8",
        name: EXPECTED_IPS_NAME,
        department: "ANTIOQUIA",
        town: "MEDELLÍN",
        address: "CALLE 54 # 49-69",
        phone: 3207240,
        email: "CALIDAD@INSTITUTODELCORAZON.ORG.CO",
        location: {
          type: "Point",
          coordinates: [-75.5656501, 6.252574],
        },
        eps: [
          {
            _id: "67b7885ec6dcb343450c057a",
            name: "COOMEVA EPS-C",
            "01_8000_phone": "18000942404",
            fax: "6044545 OPCION 1",
            emails:
              "<CLARAI_PELAEZ@COOMEVA.COM.CO>, <PAULOA_GIRALDO@COOMEVA.COM.CO>, JAZMINJ_MEZA@COOMEVA.COM.CO",
          },
          {
            _id: "67b7885ec6dcb343450c057f",
            name: "FUNDACION MEDICO PREVENTIVA EPS-C",
            "01_8000_phone": "18000111080",
            fax: "2160054",
            emails: "CENTROREGULADORANT@FUNDAMEP.COM",
          }
        ],
        specialties: [
          {
            _id: "67b3e928b1ae5d9e47ae7223",
            name: "CARDIOLOGÍA",
          },
          {
            _id: "67b3e928b1ae5d9e47ae721a",
            name: "DIAGNÓSTICO VASCULAR",
            "schedule_monday": "07:00A17:00",
            "schedule_tuesday": "07:00A17:00",
            "schedule_wednesday": "07:00A17:00",
            "schedule_thursday": "07:00A17:00",
            "schedule_friday": "07:00A17:00",
            "schedule_saturday": "07:00A13:00",
            "schedule_sunday": "07:00A13:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7222",
            name: "ENDOCRINOLOGÍA",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7224",
            name: "ENFERMERÍA",
            "schedule_monday": "06:00A19:00",
            "schedule_tuesday": "06:00A19:00",
            "schedule_wednesday": "06:00A19:00",
            "schedule_thursday": "06:00A19:00",
            "schedule_friday": "06:00A19:00",
            "schedule_saturday": "06:00A19:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7226",
            name: "GINECOBSTETRICIA",
            "schedule_monday": "07:00A18:00",
            "schedule_tuesday": "07:00A18:00",
            "schedule_wednesday": "07:00A18:00",
            "schedule_thursday": "07:00A18:00",
            "schedule_friday": "07:00A18:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7225",
            name: "MEDICINA GENERAL",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7227",
            name: "MEDICINA INTERNA",
          },
          {
            _id: "67b3e928b1ae5d9e47ae722b",
            name: "NEUROLOGÍA",
            "schedule_tuesday": "08:00A17:00",
            "schedule_wednesday": "08:00A17:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7228",
            name: "NUTRICIÓN Y DIETÉTICA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae7229",
            name: "PSICOLOGÍA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae721c",
            name: "TERAPIA RESPIRATORIA",
            "schedule_monday": "07:00A19:00",
            "schedule_tuesday": "07:00A19:00",
            "schedule_wednesday": "07:00A19:00",
            "schedule_thursday": "07:00A19:00",
            "schedule_friday": "07:00A19:00",
            "schedule_saturday": "07:00A19:00",
          },
          {
            _id: "67b3e928b1ae5d9e47ae721f",
            name: "TOMA DE MUESTRAS DE LABORATORIO CLÍNICO",
            "schedule_monday": "06:00A14:00",
            "schedule_tuesday": "06:00A14:00",
            "schedule_wednesday": "06:00A14:00",
            "schedule_thursday": "06:00A14:00",
            "schedule_friday": "06:00A14:00",
          },
        ],
      };

      expect(ips?.toResponse()).toMatchObject(EXPECTED_DATA);
    });
  });
});
