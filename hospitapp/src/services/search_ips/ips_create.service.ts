import { injectable, inject } from "inversify";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { TYPES } from "@/adapters/types";
import type IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import { IpsResponse } from "@/models/ips.interface";
import type SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { SpecialtyResponse } from "@/models/specialty.interface";
import type EPSRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { EpsResponse } from "@/models/eps.interface";
import { Ips } from "@/models/ips";


/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class IpsCreateService implements IpsRepositoryAdapter {

    constructor(
        @inject(TYPES.IpsRepositoryAdapter) private ipsRepository: IpsRepositoryAdapter,
        @inject(TYPES.SpecialtyRepositoryAdapter) private specialtyRepository: SpecialtyRepositoryAdapter,
        @inject(TYPES.EpsRepositoryAdapter) private epsRepository: EPSRepositoryAdapter
        
    ) { }    
    findAllByDistanceSpecialtyEps(longitude: number | null, latitude: number | null, max_distance: number | null, specialties: string[], eps_names: string[], page: number, page_size: number): Promise<{ results: Ips[]; total: number; }> {
        throw new Error("Method not implemented.");
    }
    findByName(name: string): Promise<Ips | null> {
        throw new Error("Method not implemented.");
    }
    create(ips: Ips): Promise<Ips | null> {
        throw new Error("Method not implemented.");
    }


}
