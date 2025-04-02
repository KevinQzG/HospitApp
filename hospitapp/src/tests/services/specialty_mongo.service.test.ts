import { Container } from "inversify";
import { TYPES } from "@/adapters/types";
import { SpecialtyMongoService } from "@/services/specialty_mongo.service";
import type SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import SpecialtyServiceAdapter from "@/adapters/services/specialty.service.adapter";

describe("SpecialtyMongoService Integration Test", () => {
	const CONTAINER = new Container();
	let service: SpecialtyMongoService;
	let mockSpecialtyRepository: jest.Mocked<SpecialtyRepositoryAdapter>;

	beforeAll(() => {
		mockSpecialtyRepository = {
			findAll: jest.fn().mockResolvedValue([
				{
					toResponse: () => ({
						_id: "67b3e98bb1ae5d9e47ae7a08",
						name: "ENFERMERÍA",
					}),
				},
			]),
		};

		CONTAINER.bind<SpecialtyRepositoryAdapter>(
			TYPES.SpecialtyRepositoryAdapter
		).toConstantValue(mockSpecialtyRepository);
		CONTAINER.bind<SpecialtyServiceAdapter>(TYPES.SpecialtyServiceAdapter).to(
			SpecialtyMongoService
		);

		service = CONTAINER.get<SpecialtyMongoService>(
			TYPES.SpecialtyServiceAdapter
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getSpecialties", () => {
		it("should retrieve and transform all specialties", async () => {
			const specialties = await service.getAllSpecialties();

			expect(mockSpecialtyRepository.findAll).toHaveBeenCalled();
			expect(specialties).toEqual([
				{
					_id: "67b3e98bb1ae5d9e47ae7a08",
					name: "ENFERMERÍA",
				},
			]);
		});

		it("should handle empty specialty list", async () => {
			mockSpecialtyRepository.findAll.mockResolvedValueOnce([]);
			const specialties = await service.getAllSpecialties();

			expect(specialties).toEqual([]);
		});

		it("should handle repository errors", async () => {
			mockSpecialtyRepository.findAll.mockRejectedValueOnce(
				new Error("Specialty DB error")
			);
			await expect(service.getAllSpecialties()).rejects.toThrow(
				"Specialty DB error"
			);
		});
	});
});
