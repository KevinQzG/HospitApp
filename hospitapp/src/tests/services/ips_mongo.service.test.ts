import { Container } from "inversify";
import { TYPES } from "@/adapters/types";
import { IpsMongoService } from "@/services/ips_mongo.service";
import type IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import type IpsRepositoryAdapter from "@/adapters/repositories/ips_repository.adapter";
import type ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewMapper } from "@/utils/mappers/review_mapper";
import { IpsMapper } from "@/utils/mappers/ips_mapper";

describe("IpsMongoService Integration Test", () => {
	const CONTAINER = new Container();
	let service: IpsMongoService;
	let mockIpsRepository: jest.Mocked<IpsRepositoryAdapter>;
	let mockReviewRepository: jest.Mocked<ReviewRepositoryAdapter>;

	const TEST_COORDINATES = [-75.63813564857911, 6.133477697463028];

	const MOCK_IPS_RES: IpsResponse = {
		_id: "67b3e98bb1ae5d9e47ae7a07",
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

	const MOCK_IPS = IpsMapper.fromResponseToDomain(MOCK_IPS_RES);

	const MOCK_REVIEW = [
		ReviewMapper.fromResponseToDomain({
			_id: "67b3e98bb1ae5d9e47ae7a08",
			user: "67b3e98bb1ae5d9e47ae7a07",
			ips: "67b3e98bb1ae5d9e47ae7a06",
			rating: 4,
			comments: "Great service!",
			createdAt: "2025-04-06T12:00:00.000Z",
			lastUpdated: "2025-04-06T12:05:00.000Z",
		}),
	];

	const MOCK_REVIEW_RES = [
		{
			_id: "67b3e98bb1ae5d9e47ae7a08",
			user: "67b3e98bb1ae5d9e47ae7a07",
			ips: "67b3e98bb1ae5d9e47ae7a06",
			rating: 4,
			comments: "Great service!",
			createdAt: "2025-04-06T12:00:00.000Z",
			lastUpdated: "2025-04-06T12:05:00.000Z",
		},
	];

	beforeAll(() => {
		// Create mock repository
		mockIpsRepository = {
			findAllByDistanceSpecialtyEpsWithPagination: jest
				.fn()
				.mockResolvedValue({
					results: [
						{
							toResponse: () => MOCK_IPS_RES,
						},
					],
					total: 1,
				}),
			findByName: jest.fn().mockResolvedValue(MOCK_IPS),
			findAllByDistanceSpecialtyEps: jest
				.fn()
				.mockResolvedValue([MOCK_IPS]),
			findAllWithPagination: jest.fn().mockResolvedValue({
				results: [MOCK_IPS],
				total: 1,
			}),
			findAll: jest.fn().mockResolvedValue([MOCK_IPS]),
			create: jest.fn().mockResolvedValue("mocked_id"),
			update: jest.fn().mockResolvedValue(MOCK_IPS),
			delete: jest.fn().mockResolvedValue(true),
		};

		mockReviewRepository = {
			findAllWithPagination: jest.fn().mockResolvedValue({
				results: MOCK_REVIEW,
				total: 1,
			}),
			findAll: jest.fn().mockResolvedValue(MOCK_REVIEW),
			create: jest.fn().mockResolvedValue(MOCK_REVIEW[0].getId()),
			delete: jest.fn().mockResolvedValue(true),
			update: jest.fn().mockResolvedValue(MOCK_REVIEW[0]),
			findById: jest.fn().mockResolvedValue(MOCK_REVIEW[0]),
		};

		// Rebind repository for testing
		CONTAINER.bind<IpsRepositoryAdapter>(
			TYPES.IpsRepositoryAdapter
		).toConstantValue(mockIpsRepository);
		CONTAINER.bind<ReviewRepositoryAdapter>(
			TYPES.ReviewRepositoryAdapter
		).toConstantValue(mockReviewRepository);
		CONTAINER.bind<IpsServiceAdapter>(TYPES.IpsServiceAdapter).to(
			IpsMongoService
		);

		service = CONTAINER.get<IpsMongoService>(TYPES.IpsServiceAdapter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("filterIps", () => {
		it("should correctly delegate to repository and return documents", async () => {
			const { results, total } = await service.filterIpsWithPagination(
				TEST_COORDINATES[0],
				TEST_COORDINATES[1],
				5000,
				["ENFERMERÍA"],
				["SALUDCOOP EPS-C"],
				1,
				10,
				null
			);

			// Verify repository call
			expect(
				mockIpsRepository.findAllByDistanceSpecialtyEpsWithPagination
			).toHaveBeenCalledWith(
				TEST_COORDINATES[0],
				TEST_COORDINATES[1],
				5000,
				["ENFERMERÍA"],
				["SALUDCOOP EPS-C"],
				null,
				[
					{ field: "distance", direction: 1 },
					{ field: "rating", direction: -1 }
				],
				1,
				10,
				false
			);

			// Verify output transformation
			expect(results).toEqual([MOCK_IPS_RES]);
			expect(total).toBe(1);
		});

		it("should convert all results to IPSDocument format", async () => {
			const { results } = await service.filterIpsWithPagination(
				TEST_COORDINATES[0],
				TEST_COORDINATES[1],
				5000,
				[],
				[],
				1,
				10,
				null
			);

			results.forEach((doc) => {
				expect(doc).toMatchObject({
					_id: expect.any(String),
					name: expect.any(String),
					department: expect.any(String),
					location: {
						type: "Point",
						coordinates: expect.any(Array),
					},
				});
			});
		});

		it("should handle pagination parameters correctly", async () => {
			const { total } = await service.filterIpsWithPagination(
				TEST_COORDINATES[0],
				TEST_COORDINATES[1],
				5000,
				[],
				[],
				2,
				5,
				null
			);

			expect(
				mockIpsRepository.findAllByDistanceSpecialtyEpsWithPagination
			).toHaveBeenCalledWith(
				expect.anything(),
				expect.anything(),
				expect.anything(),
				expect.anything(),
				expect.anything(),
				null,
				[
					{ field: "distance", direction: 1 },
					{ field: "rating", direction: -1 }
				],
				2,
				5,
				false
			);
			expect(total).toBe(1);
		});

		it("should handle repository errors", async () => {
			mockIpsRepository.findAllByDistanceSpecialtyEpsWithPagination.mockRejectedValueOnce(
				new Error("DB error")
			);

			await expect(
				service.filterIpsWithPagination(
					TEST_COORDINATES[0],
					TEST_COORDINATES[1],
					5000,
					[],
					[],
					1,
					10,
					null
				)
			).rejects.toThrow("DB error");
		});
	});

	describe("getIpsByName", () => {
		it("should retrieve IPS by ID and return transformed response", async () => {
			const name = "ESE HOSPITAL VENANCIO DIAZ DIAZ";
			const result = await service.getIpsByName(name);

			expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
			expect(result).toEqual(MOCK_IPS_RES);
		});

		it("should return null if IPS is not found", async () => {
			const name = "non_existent_name";
			mockIpsRepository.findByName.mockResolvedValueOnce(null);

			const result = await service.getIpsByName(name);

			expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
			expect(result).toBeNull();
		});

		it("should handle repository errors", async () => {
			const name = "error_name";
			const error = new Error("DB error");
			mockIpsRepository.findByName.mockRejectedValueOnce(error);

			await expect(service.getIpsByName(name)).rejects.toThrow(error);
		});
	});

	describe("getIpsByNameWithReviews", () => {
		it("should retrieve IPS and its reviews", async () => {
			const name = "ESE HOSPITAL VENANCIO DIAZ DIAZ";
			const page = 1;
			const pageSize = 10;

			const { ips, reviewsResult } =
				await service.getIpsByNameWithReviewsPagination(
					name,
					page,
					pageSize,
					[
						{ field: "rating", direction: -1 },
						{ field: "updatedAt", direction: 1 },
					]
				);

			expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
			expect(
				mockReviewRepository.findAllWithPagination
			).toHaveBeenCalledWith(
				page,
				pageSize,
				[
					{ field: "rating", direction: -1 },
					{ field: "updatedAt", direction: 1 },
				],
				MOCK_IPS.getId(),
				undefined
			);
			expect(ips).toEqual(MOCK_IPS_RES);
			expect(reviewsResult).toEqual({
				reviews: MOCK_REVIEW_RES,
				total: 1,
			});
		});

		it("should return null IPS and empty reviews if IPS not found", async () => {
			const name = "non_existent_name";
			mockIpsRepository.findByName.mockResolvedValueOnce(null);

			const { ips, reviewsResult } =
				await service.getIpsByNameWithReviewsPagination(name, 1, 10);

			expect(mockIpsRepository.findByName).toHaveBeenCalledWith(name);
			expect(ips).toBeNull();
			expect(reviewsResult).toEqual({ reviews: [], total: 0 });
		});

		it("should handle repository errors", async () => {
			const name = "error_name";
			const error = new Error("DB error");
			mockIpsRepository.findByName.mockRejectedValueOnce(error);

			await expect(
				service.getIpsByNameWithReviewsPagination(name, 1, 10)
			).rejects.toThrow(error);
		});
	});
});
