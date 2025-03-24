import { injectable, inject } from "inversify";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { TYPES } from "@/adapters/types";
import type IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import { IpsResponse } from "@/models/ips.interface";
import type SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { SpecialtyResponse } from "@/models/specialty.interface";
import type EPSRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { EpsResponse } from "@/models/eps.interface";


/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class SearchIpsMongoService implements SearchIpsServiceAdapter {
    /**
     * @constructor
     * @param {IpsRepositoryAdapter} ips_repository - The repository handler for IPSs.
     * @param {SpecialtyRepositoryAdapter} specialty_repository - The repository handler for specialties.
     * @param {EPSRepositoryAdapter} eps_repository - The repository handler for EPSs.
     * @returns {void}
     * @description Creates an instance of the FilterAndSortIpsService class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(TYPES.IpsRepositoryAdapter) private ips_repository: IpsRepositoryAdapter,
        @inject(TYPES.SpecialtyRepositoryAdapter) private specialty_repository: SpecialtyRepositoryAdapter,
        @inject(TYPES.EpsRepositoryAdapter) private eps_repository: EPSRepositoryAdapter
        
    ) { }

    async filter_ips(longitude: number | null, latitude: number | null, max_distance: number | null, specialties: string[], eps_names: string[], page: number, page_size: number): Promise<{ results: IpsResponse[]; total: number; }> {
        const _RESULTS = await this.ips_repository.find_all_by_distance_specialty_eps(longitude, latitude, max_distance, specialties, eps_names, page, page_size);

        return {
            results: _RESULTS.results.map(ips => {return ips.to_response();}),
            total: _RESULTS.total
        };
    }

    async get_all_specialties(): Promise<SpecialtyResponse[]> {
        const _SPECIALTIES = await this.specialty_repository.find_all();
        return _SPECIALTIES.map(specialty => {return specialty.to_response();});
    }

    async get_all_eps(): Promise<EpsResponse[]> {
        const _EPS = await this.eps_repository.find_all();
        return _EPS.map(eps => {return eps.to_response();});
    }

    async get_ips_by_name(name: string): Promise<IpsResponse | null> {
        const _IPS = await this.ips_repository.find_by_name(name);
        if (!_IPS) {
            return null;
        }
        return _IPS.to_response();
    }
}