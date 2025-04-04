import { Container } from "inversify";
import { TYPES } from "@/adapters/types";
import { ReviewMongoService } from "@/services/review_mongo.service";
import type ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";
import type ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import { Review } from "@/models/review";
import { ObjectId } from "mongodb";

describe("ReviewMongoService Integration Test", () => {
	let service: ReviewMongoService;
	let mockReviewRepository: jest.Mocked<ReviewRepositoryAdapter>;
	const CONTAINER = new Container();

	const MOCK_REVIEW = new Review(
		undefined,
		new ObjectId("67b3e98bb1ae5d9e47ae72a8"), // ips
		new ObjectId("67e56e4f41a98261d95547d4"), // user
		5,
		"Great service!"
	);

	const MOCK_UPDATED_REVIEW = new Review(
		new ObjectId("67ed23719c60d5e529e84b49"),
		new ObjectId("67b3e98bb1ae5d9e47ae72a8"),
		new ObjectId("67e56e4f41a98261d95547d4"),
		4,
		"Updated service!"
	);

	beforeAll(() => {
		// Mock ReviewRepositoryAdapter
		mockReviewRepository = {
			findAllWithPagination: jest.fn().mockResolvedValue({
				results: [MOCK_REVIEW],
				total: 1,
			}),
			findAll: jest.fn().mockResolvedValue([MOCK_REVIEW]),
			create: jest.fn().mockResolvedValue(MOCK_REVIEW.getIps()),
			update: jest.fn().mockResolvedValue(MOCK_UPDATED_REVIEW),
			delete: jest.fn().mockResolvedValue(true),
			findById: jest.fn().mockResolvedValue(MOCK_REVIEW),
		};

		// Bind mocks to container
		CONTAINER.bind<ReviewRepositoryAdapter>(
			TYPES.ReviewRepositoryAdapter
		).toConstantValue(mockReviewRepository);
		CONTAINER.bind<ReviewServiceAdapter>(TYPES.ReviewServiceAdapter).to(
			ReviewMongoService
		);

		service = CONTAINER.get<ReviewMongoService>(TYPES.ReviewServiceAdapter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("findAllWithPagination", () => {
		it("should retrieve all reviews with pagination and transform to response", async () => {
			const { results, total } = await service.findAllWithPagination(
				1,
				10,
				"67b3e98bb1ae5d9e47ae72a8"
			);

			expect(
				mockReviewRepository.findAllWithPagination
			).toHaveBeenCalledWith(
				1,
				10,
				new ObjectId("67b3e98bb1ae5d9e47ae72a8")
			);
			expect(results).toEqual([MOCK_REVIEW.toResponse()]);
			expect(total).toBe(1);
		});

		it("should handle empty results", async () => {
			mockReviewRepository.findAllWithPagination.mockResolvedValueOnce({
				results: [],
				total: 0,
			});

			const { results, total } = await service.findAllWithPagination(
				1,
				10
			);

			expect(results).toEqual([]);
			expect(total).toBe(0);
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.findAllWithPagination.mockRejectedValueOnce(
				error
			);

			await expect(service.findAllWithPagination(1, 10)).rejects.toThrow(
				error
			);
		});
	});

	describe("findAll", () => {
		it("should retrieve all reviews and transform to response", async () => {
			const results = await service.findAll("67b3e98bb1ae5d9e47ae72a8");

			expect(mockReviewRepository.findAll).toHaveBeenCalledWith(
				new ObjectId("67b3e98bb1ae5d9e47ae72a8")
			);
			expect(results).toEqual([MOCK_REVIEW.toResponse()]);
		});

		it("should handle empty results", async () => {
			mockReviewRepository.findAll.mockResolvedValueOnce([]);

			const results = await service.findAll();

			expect(results).toEqual([]);
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.findAll.mockRejectedValueOnce(error);

			await expect(service.findAll()).rejects.toThrow(error);
		});
	});

	describe("create", () => {
		it("should create a new review and return its ID", async () => {
			await service.create(
				"67b3e98bb1ae5d9e47ae72a8",
				"67e56e4f41a98261d95547d4",
				5,
				"Great service!"
			);

			expect(mockReviewRepository.create).toHaveBeenCalledWith(
				expect.any(Review)
			);
		});

		it("should return null if creation fails", async () => {
			mockReviewRepository.create.mockResolvedValueOnce(null);

			const id = await service.create(
				"67b3e98bb1ae5d9e47ae72a8",
				"67e56e4f41a98261d95547d4",
				5,
				"Great service!"
			);

			expect(id).toBeNull();
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.create.mockRejectedValueOnce(error);

			await expect(
				service.create(
					"67b3e98bb1ae5d9e47ae72a8",
					"67e56e4f41a98261d95547d4",
					5,
					"Great service!"
				)
			).rejects.toThrow(error);
		});
	});

	describe("update", () => {
		it("should update a review and return the updated response", async () => {
			const result = await service.update(
				"67ed23719c60d5e529e84b49",
				"67b3e98bb1ae5d9e47ae72a8",
				"67e56e4f41a98261d95547d4",
				4,
				"Updated service!"
			);

			expect(mockReviewRepository.update).toHaveBeenCalledWith(
				expect.any(Review)
			);
			expect(result).toEqual(MOCK_UPDATED_REVIEW.toResponse());
		});

		it("should return null if update fails", async () => {
			mockReviewRepository.update.mockResolvedValueOnce(null);

			const result = await service.update(
				"67ed23719c60d5e529e84b49",
				"67b3e98bb1ae5d9e47ae72a8",
				"67e56e4f41a98261d95547d4",
				4,
				"Updated service!"
			);

			expect(result).toBeNull();
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.update.mockRejectedValueOnce(error);

			await expect(
				service.update(
					"67ed23719c60d5e529e84b49",
					"67b3e98bb1ae5d9e47ae72a8",
					"67e56e4f41a98261d95547d4",
					4,
					"Updated service!"
				)
			).rejects.toThrow(error);
		});
	});

	describe("delete", () => {
		it("should delete a review and return true", async () => {
			const result = await service.delete("67ed23719c60d5e529e84b49");

			expect(mockReviewRepository.delete).toHaveBeenCalledWith(
				new ObjectId("67ed23719c60d5e529e84b49")
			);
			expect(result).toBe(true);
		});

		it("should return false if delete fails", async () => {
			mockReviewRepository.delete.mockResolvedValueOnce(false);

			const result = await service.delete("67ed23719c60d5e529e84b49");

			expect(result).toBe(false);
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.delete.mockRejectedValueOnce(error);

			await expect(
				service.delete("67ed23719c60d5e529e84b49")
			).rejects.toThrow(error);
		});
	});

	describe("findById", () => {
		it("should retrieve a review by ID and transform to response", async () => {
			const result = await service.findById(
				"67ed23719c60d5e529e84b49"
			);

			expect(mockReviewRepository.findById).toHaveBeenCalledWith(
				new ObjectId("67ed23719c60d5e529e84b49")
			);
			expect(result).toEqual(MOCK_REVIEW.toResponse());
		});

		it("should return null if review not found", async () => {
			mockReviewRepository.findById.mockResolvedValueOnce(null);

			const result = await service.findById(
				"67ed23719c60d5e529e84b49"
			);

			expect(result).toBeNull();
		});

		it("should throw repository errors", async () => {
			const error = new Error("DB error");
			mockReviewRepository.findById.mockRejectedValueOnce(error);

			await expect(
				service.findById("67ed23719c60d5e529e84b49")
			).rejects.toThrow(error);
		});
	});
});
