import { injectable, inject } from "inversify";
import { TYPES } from "@/adapters/types";
import type SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { SpecialtyResponse } from "@/models/specialty.interface";
import SpecialtyServiceAdapter from "@/adapters/services/specialty.service.adapter";

/**
 * @class
 * @name SpecialtyMongoService
 * @description This class contains the logic to interact with the specialty collection in the database.
 */
@injectable()
export class SpecialtyMongoService implements SpecialtyServiceAdapter {
	/**
	 * @constructor
	 * @param {SpecialtyRepositoryAdapter} specialtyRepository - The repository handler for specialties.
	 * @returns {void}
	 * @description Creates an instance of the FilterAndSortIpsService class.
	 * @throws {Error} If the database handler is null.
	 * @throws {Error} If the database connection fails.
	 */
	constructor(
		@inject(TYPES.SpecialtyRepositoryAdapter)
		private specialtyRepository: SpecialtyRepositoryAdapter
	) {}

	async getAllSpecialties(): Promise<SpecialtyResponse[]> {
		const SPECIALTIES = await this.specialtyRepository.findAll();
		return SPECIALTIES.map((specialty) => {
			return specialty.toResponse();
		});
	}
}
