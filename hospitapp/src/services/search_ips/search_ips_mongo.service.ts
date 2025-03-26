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
     * @param {IpsRepositoryAdapter} ipsRepository - The repository handler for IPSs.
     * @param {SpecialtyRepositoryAdapter} specialtyRepository - The repository handler for specialties.
     * @param {EPSRepositoryAdapter} epsRepository - The repository handler for EPSs.
     * @returns {void}
     * @description Creates an instance of the FilterAndSortIpsService class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(TYPES.IpsRepositoryAdapter) private ipsRepository: IpsRepositoryAdapter,
        @inject(TYPES.SpecialtyRepositoryAdapter) private specialtyRepository: SpecialtyRepositoryAdapter,
        @inject(TYPES.EpsRepositoryAdapter) private epsRepository: EPSRepositoryAdapter
        
    ) { }

    async filterIps(longitude: number | null, latitude: number | null, maxDistance: number | null, specialties: string[], epsNames: string[], page: number, pageSize: number): Promise<{ results: IpsResponse[]; total: number; }> {
        const RESULTS = await this.ipsRepository.findAllByDistanceSpecialtyEps(longitude, latitude, maxDistance, specialties, epsNames, page, pageSize);

        return {
            results: RESULTS.results.map(ips => {return ips.toResponse();}),
            total: RESULTS.total
        };
    }

    async getAllSpecialties(): Promise<SpecialtyResponse[]> {
        const SPECIALTIES = await this.specialtyRepository.findAll();
        return SPECIALTIES.map(specialty => {return specialty.toResponse();});
    }

    async getAllEps(): Promise<EpsResponse[]> {
        const EPS = await this.epsRepository.findAll();
        return EPS.map(eps => {return eps.toResponse();});
    }

    async getIpsByName(name: string): Promise<IpsResponse | null> {
        const IPS = await this.ipsRepository.findByName(name);
        if (!IPS) {
            return null;
        }
        return IPS.toResponse();
    }
}