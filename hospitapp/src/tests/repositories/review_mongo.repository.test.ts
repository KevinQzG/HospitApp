import { ObjectId } from "mongodb";
import DBAdapter from "@/adapters/db.adapter";
import ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";
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
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				new ObjectId("67b3e98bb1ae5d9e47ae72a8")
			);

			// Verify all items are Review instances
			results.results.forEach((review) => {
				expect(review).toBeInstanceOf(Review);
			});
		});

		it("should return correct Review document structure", async () => {
			results = await repository.findAllWithPagination(
				1,
				10,
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				new ObjectId("67b3e98bb1ae5d9e47ae78e8")
			);
			const SAMPLE_EPS = results.results[0];

			const EXPECTED_DATA = {
				_id: "680a8b132c7db505d8e049d1",
				ips: "67b3e98bb1ae5d9e47ae78e8",
				user: "68084f1d157be2f18f17996a",
				rating: 5,
				comments: "Testing Reviews Repo",
				userEmail: "admin.test@example.com",
				ipsName: "CORPORACION PARA EL AVANCE EN SALUD AVANSALUD",
			};

			expect(SAMPLE_EPS.toResponse()).toMatchObject(EXPECTED_DATA);
		});
	});

	describe("findAll", () => {
		it("should retrieve all Review documents", async () => {
			results.results = await repository.findAll(
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				new ObjectId("67b3e98bb1ae5d9e47ae78e8")
			);

			// Verify total count
			expect(results.results.length).toBeGreaterThanOrEqual(1);

			// Verify all items are Review instances
			results.results.forEach((review) => {
				expect(review).toBeInstanceOf(Review);
			});
		});

		it("should return correct Review document structure", async () => {
			results.results = await repository.findAll(
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				new ObjectId("67b3e98bb1ae5d9e47ae78e8")
			);
			const SAMPLE_EPS = results.results[0];

			const EXPECTED_DATA = {
				_id: "680a8b132c7db505d8e049d1",
				ips: "67b3e98bb1ae5d9e47ae78e8",
				user: "68084f1d157be2f18f17996a",
				rating: 5,
				comments: "Testing Reviews Repo",
				userEmail: "admin.test@example.com",
				ipsName: "CORPORACION PARA EL AVANCE EN SALUD AVANSALUD",
			};

			expect(SAMPLE_EPS.toResponse()).toMatchObject(EXPECTED_DATA);
		});
	});

	describe("Create, update and delete", () => {
		const REVIEW = new Review(
			undefined,
			new ObjectId("68084f1d157be2f18f17996a"),
			new ObjectId("67b3e98bb1ae5d9e47ae72ad"),
			5,
			"Great service!"
		);

		it("should create a new Review", async () => {
			const CREATED_REVIEW_ID = await repository.create(REVIEW);

			expect(CREATED_REVIEW_ID).toBeInstanceOf(ObjectId);
			expect(CREATED_REVIEW_ID).toEqual(REVIEW.getId());

			const CREATED_REVIEW = await repository.findAll(
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				REVIEW.getIps()
			);

			expect(CREATED_REVIEW.length).toBe(1);
			expect(CREATED_REVIEW[0].getId()).toEqual(REVIEW.getId());
		});

		it("should update the Review", async () => {
			REVIEW.setComments("Updated comment");

			const UPDATED_REVIEW = await repository.update(REVIEW);

			expect(UPDATED_REVIEW).toBeInstanceOf(Review);
			expect(UPDATED_REVIEW?.getId()).toEqual(REVIEW.getId());
			expect(UPDATED_REVIEW?.getComments()).toEqual(REVIEW.getComments());
			expect(UPDATED_REVIEW?.getRating()).toEqual(REVIEW.getRating());
			expect(UPDATED_REVIEW?.getUser()).toEqual(REVIEW.getUser());
			expect(UPDATED_REVIEW?.getIps()).toEqual(REVIEW.getIps());
		});

		it("should delete the Review", async () => {
			const DELETED_REVIEW = await repository.delete(REVIEW.getId());

			expect(DELETED_REVIEW).toBe(true);

			const DELETED_REVIEW_CHECK = await repository.findAll(
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				REVIEW.getIps()
			);

			expect(DELETED_REVIEW_CHECK.length).toBe(0);
		});
	});

	describe("findById", () => {
		it("should retrieve a Review document by ID", async () => {
			const SAMPLE_ID = new ObjectId("680a8b132c7db505d8e049d1");
			const REVIEW = await repository.findById(SAMPLE_ID);

			expect(REVIEW).toBeInstanceOf(Review);
			expect(REVIEW?.getId()).toEqual(SAMPLE_ID);
		});

		it("should return all the review structure", async () => {
			const SAMPLE_ID = new ObjectId("680a8b132c7db505d8e049d1");
			const REVIEW = await repository.findById(SAMPLE_ID);

			expect(REVIEW).toBeInstanceOf(Review);
			expect(REVIEW?.getId()).toEqual(SAMPLE_ID);
			expect(REVIEW?.getIps()).toEqual(
				new ObjectId("67b3e98bb1ae5d9e47ae78e8")
			);
			expect(REVIEW?.getUser()).toEqual(
				new ObjectId("68084f1d157be2f18f17996a")
			);
			expect(REVIEW?.getRating()).toEqual(5);
			expect(REVIEW?.getComments()).toEqual("Testing Reviews Repo");
			expect(REVIEW?.getIpsName()).toEqual(
				"CORPORACION PARA EL AVANCE EN SALUD AVANSALUD"
			);
			expect(REVIEW?.getUserEmail()).toEqual("admin.test@example.com");
		});

		it("should return null for non-existent ID", async () => {
			const NON_EXISTENT_ID = new ObjectId("67e56e4f41a98261d95547d4");
			const REVIEW = await repository.findById(NON_EXISTENT_ID);

			expect(REVIEW).toBeNull();
		});
	});
});
