import MongoDB from "@/config/mongo_db";
import { ObjectId } from "mongodb";
import CONTAINER from "@/adapters/container"; // Import your Inversify container
import { TYPES } from "@/adapters/types"; // Import your dependency injection symbols

describe("MongoDB Singleton Test", () => {
	const FILTER = { _id: new ObjectId("67b7885ec6dcb343450c0582") };
	const EXPECTED_RESULT = [
		{
			_id: new ObjectId("67b7885ec6dcb343450c0582"),
			name: "COMFAMILIARCAMACOL EPS-S",
			"01_8000_phone": "018000 111776",
			fax: "2609442",
			emails: "REFERENCIA@COMFAMILIARCAMACOL.COM",
		},
	];

	let mongoClient1: MongoDB;
	let mongoClient2: MongoDB;

	beforeAll(() => {
		// Get instances through the container
		mongoClient1 = CONTAINER.get<MongoDB>(TYPES.DBAdapter);
		mongoClient2 = CONTAINER.get<MongoDB>(TYPES.DBAdapter);
	});

	afterAll(async () => {
		await mongoClient1.close();
	});

	it("should return the same instance through container", () => {
		expect(mongoClient1).toBe(mongoClient2); // Strict equality check
	});

	it("should maintain single connection instance", async () => {
		const DB1 = await mongoClient1.connect();
		const DB2 = await mongoClient2.connect();

		expect(DB1).toBe(DB2); // Both should reference the same DB instance
	});

	it("should handle multiple connect calls efficiently", async () => {
		const INITIAL_CONNECTION = await mongoClient1.connect();
		const SECOND_CONNECTION = await mongoClient1.connect();

		expect(SECOND_CONNECTION).toBe(INITIAL_CONNECTION); // Same instance
	});

	it("should find a document", async () => {
		const DB = await mongoClient1.connect();
		const RESULT = await DB.collection("EPS").find(FILTER).toArray();
		expect(RESULT).toEqual(EXPECTED_RESULT);
	});
});
