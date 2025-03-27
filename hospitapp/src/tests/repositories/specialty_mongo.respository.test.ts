import { ObjectId } from "mongodb";
import DBAdapter from "@/adapters/db.adapter";
import SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { Specialty } from "@/models/specialty";

describe("SpecialtyMongoRepository Integration Test", () => {
  let dbHandler: DBAdapter;
  let repository: SpecialtyRepositoryAdapter;

  let results: Specialty[];

  beforeAll(async () => {
    dbHandler = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
    repository = CONTAINER.get<SpecialtyRepositoryAdapter>(
      TYPES.SpecialtyRepositoryAdapter
    );
    await dbHandler.connect();
  });

  afterAll(async () => {
    await dbHandler.close();
  });

  describe("find_all", () => {
    it("should retrieve all Specialty documents", async () => {
      results = await repository.findAll();

      // Verify total count
      expect(results).toHaveLength(138);

      // Verify all items are EPS instances
      results.forEach((eps) => {
        expect(eps).toBeInstanceOf(Specialty);
      });
    });

    it("should return correct EPS document structure", async () => {
      results = await repository.findAll();
      const SAMPLE_EPS = results[0];

      const EXPECTED_DATA = {
        _id: new ObjectId("67b3e928b1ae5d9e47ae722d"),
        name: "ANESTESIA",
      };

      expect(SAMPLE_EPS.toObject()).toMatchObject(EXPECTED_DATA);
    });
  });
});
