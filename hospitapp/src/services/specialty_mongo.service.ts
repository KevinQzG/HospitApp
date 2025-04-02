import { injectable, inject } from "inversify";
import { TYPES } from "@/adapters/types";
import type SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { SpecialtyResponse } from "@/models/specialty.interface";
import type EPSRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { EpsResponse } from "@/models/eps.interface";
import SpecialtyServiceAdapter from "@/adapters/services/specialty.service.adapter";

/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class SpecialtyMongoService implements SpecialtyServiceAdapter {
	/**
	 * @constructor
	 * @param {SpecialtyRepositoryAdapter} specialtyRepository - The repository handler for specialties.
	 * @param {EPSRepositoryAdapter} epsRepository - The repository handler for EPSs.
	 * @returns {void}
	 * @description Creates an instance of the FilterAndSortIpsService class.
	 * @throws {Error} If the database handler is null.
	 * @throws {Error} If the database connection fails.
	 */
	constructor(
		@inject(TYPES.SpecialtyRepositoryAdapter)
		private specialtyRepository: SpecialtyRepositoryAdapter,
		@inject(TYPES.EpsRepositoryAdapter)
		private epsRepository: EPSRepositoryAdapter,
	) {}

	async getAllSpecialties(): Promise<SpecialtyResponse[]> {
		const SPECIALTIES = await this.specialtyRepository.findAll();
		return SPECIALTIES.map((specialty) => {
			return specialty.toResponse();
		});
	}

	async getAllEps(): Promise<EpsResponse[]> {
		const EPS = await this.epsRepository.findAll();
		return EPS.map((eps) => {
			return eps.toResponse();
		});
	}
}
