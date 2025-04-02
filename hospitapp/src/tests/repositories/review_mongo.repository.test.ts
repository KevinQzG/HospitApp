import { ObjectId } from "mongodb";
import DBAdapter from "@/adapters/db.adapter";
import ReviewRepositoryAdapter from "@/adapters/review_repository.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { Review } from "@/models/review";

describe("ReviewMongoRepository Integration Test", () => {
	let dbHandler: DBAdapter;
	let repository: ReviewRepositoryAdapter;

	let results: {
		results: Review[];
		total: number;
	};

	beforeAll(async () => {
		dbHandler = CONTAINER.get<DBAdapter>(TYPES.DBAdapter);
		repository = CONTAINER.get<ReviewRepositoryAdapter>(
			TYPES.ReviewRepositoryAdapter
		);
		await dbHandler.connect();
	});

	afterAll(async () => {
		await dbHandler.close();
	});

	describe("findAllWithPagination", () => {
		it("should retrieve all Review documents", async () => {
			results = await repository.findAllWithPagination(
				1,
				10,
				new ObjectId("67b3e98bb1ae5d9e47ae72a8")
			);

			// Verify total count
			expect(results.results).toHaveLength(10);
			expect(results.total).toBeGreaterThanOrEqual(10);

			// Verify all items are Review instances
			results.results.forEach((review) => {
				expect(review).toBeInstanceOf(Review);
			});
		});

		it("should return correct Review document structure", async () => {
			results = await repository.findAllWithPagination(
				1,
				10,
				new ObjectId("67b3e98bb1ae5d9e47ae72a8")
			);
			const SAMPLE_EPS = results.results[0];
			// Verify total count
			expect(results.results).toHaveLength(10);
			expect(results.total).toBeGreaterThanOrEqual(10);

			const EXPECTED_DATA = {
				_id: "67ed23719c60d5e529e84b49",
				ips: "67b3e98bb1ae5d9e47ae72a8",
				user: "67e56e4f41a98261d95547d4",
				rating: 5,
				comments:
					"Muy buena atención, pero es un lugar demasiado caro y que te cobran por lo que sea.",
				userEmail: "ADMIN@example.com",
			};

			expect(SAMPLE_EPS.toResponse()).toMatchObject(EXPECTED_DATA);
		});
	});
});
