import { Container } from "inversify";
import { TYPES } from "@/adapters/types";
import { EpsMongoService } from "@/services/eps_mongo.service";
import type EpsRepositoryAdapter from "@/adapters/repositories/eps_repository.adapter";
import EpsServiceAdapter from "@/adapters/services/eps.service.adapter";

describe("EpsMongoService Integration Test", () => {
	const CONTAINER = new Container();
	let service: EpsMongoService;
	let mockEpsRepository: jest.Mocked<EpsRepositoryAdapter>;

	beforeAll(() => {
		mockEpsRepository = {
			findAll: jest.fn().mockResolvedValue([
				{
					toResponse: () => ({
						_id: "67b3e98bb1ae5d9e47ae7a09",
						name: "SALUD TOTAL",
					}),
				},
			]),
		};

		CONTAINER.bind<EpsRepositoryAdapter>(
			TYPES.EpsRepositoryAdapter
		).toConstantValue(mockEpsRepository);
		CONTAINER.bind<EpsServiceAdapter>(TYPES.EpsServiceAdapter).to(
			EpsMongoService
		);

		service = CONTAINER.get<EpsMongoService>(TYPES.EpsServiceAdapter);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getEps", () => {
		it("should retrieve and transform all EPS entries", async () => {
			const epsList = await service.getAllEps();

			expect(mockEpsRepository.findAll).toHaveBeenCalled();
			expect(epsList).toEqual([
				{
					_id: "67b3e98bb1ae5d9e47ae7a09",
					name: "SALUD TOTAL",
				},
			]);
		});

		it("should handle empty EPS list", async () => {
			mockEpsRepository.findAll.mockResolvedValueOnce([]);
			const epsList = await service.getAllEps();

			expect(epsList).toEqual([]);
		});

		it("should handle repository errors", async () => {
			mockEpsRepository.findAll.mockRejectedValueOnce(
				new Error("EPS DB error")
			);
			await expect(service.getAllEps()).rejects.toThrow("EPS DB error");
		});
	});
});
