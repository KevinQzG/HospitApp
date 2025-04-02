import { injectable, inject } from "inversify";
import { TYPES } from "@/adapters/types";
import type EPSRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { EpsResponse } from "@/models/eps.interface";
import EpsServiceAdapter from "@/adapters/services/eps.service.adapter";

/**
 * @class
 * @name SpecialtyMongoService
 * @description This class contains the logic to interact with the specialty collection in the database.
 */
@injectable()
export class EpsMongoService implements EpsServiceAdapter {
	/**
	 * @constructor
	 * @param {EPSRepositoryAdapter} epsRepository - The repository handler for EPSs.
	 * @returns {void}
	 * @description Creates an instance of the FilterAndSortIpsService class.
	 * @throws {Error} If the database handler is null.
	 * @throws {Error} If the database connection fails.
	 */
	constructor(
		@inject(TYPES.EpsRepositoryAdapter)
		private epsRepository: EPSRepositoryAdapter,
	) {}

	async getAllEps(): Promise<EpsResponse[]> {
		const EPS = await this.epsRepository.findAll();
		return EPS.map((eps) => {
			return eps.toResponse();
		});
	}
}
