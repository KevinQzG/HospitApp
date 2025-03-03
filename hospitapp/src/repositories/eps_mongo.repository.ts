import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import EpsRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { _TYPES } from "@/adapters/types";
import { EPSDocument } from "@/models/eps.interface";
import { EPS } from "@/models/eps";
import type DBAdapter from "@/adapters/db.adapter";
import { EPSMapper } from "@/utils/mappers/eps_mapper";
// import { IpsPipelineBuilder } from "./builders/ips.pipeline.builder";

/**
 * @class
 * @name EpsMongoRepository
 * @description This class allows me to interact with the EPS collection in the database.
 */
@injectable()
export class EpsMongoRepository implements EpsRepositoryAdapter {
    /**
     * @constructor
     * @param {DBAdapter} db_handler - The database handler.
     * @returns {void}
     * @description Creates an instance of the IpsMongoRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(_TYPES.DBAdapter) private db_handler: DBAdapter<Db>
    ) { }

    async find_all(): Promise<EPS[]> {
        // Get all the EPS Documents
        const _DB = await this.db_handler.connect();
        const _RESULTS = await _DB.collection<EPSDocument>('EPS').find().toArray();
        
        if (!_RESULTS) {
            return [];
        }

        // Map the results to EPS entities
        return _RESULTS.map(EPSMapper.to_domain);
    }
}