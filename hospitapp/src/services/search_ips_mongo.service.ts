import { injectable, inject } from "inversify";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import type IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import { _TYPES } from "@/adapters/types";
import { IPSDocument } from "@/models/ips.interface";

/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class SearchIpsMongoService implements SearchIpsServiceAdapter {
    /**
     * @constructor
     * @param {IpsRepositoryAdapter} repository - The repository handler for IPSs.
     * @returns {void}
     * @description Creates an instance of the FilterAndSortIpsService class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(_TYPES.IpsRepositoryAdapter) private repository: IpsRepositoryAdapter
    ) { }

    async filter(longitude: number, latitude: number, max_distance: number, specialties: string[], eps_names: string[], page: number, page_size: number): Promise<{ results: IPSDocument[]; total: number; }> {
        const _RESULTS = await this.repository.find_all_by_distance_specialty_eps(longitude, latitude, max_distance, specialties, eps_names, page, page_size);

        return {
            results: _RESULTS.results.map(ips => {return ips.toObject();}),
            total: _RESULTS.total
        };
    }
}