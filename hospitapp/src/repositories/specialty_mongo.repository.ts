import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { _TYPES } from "@/adapters/types";
import { SpecialtyDocument } from "@/models/specialty.interface";
import { Specialty } from "@/models/specialty";
import type DBAdapter from "@/adapters/db.adapter";
import { SpecialtyMapper } from "@/utils/mappers/specialty_mapper";
// import { IpsPipelineBuilder } from "./builders/ips.pipeline.builder";

/**
 * @class
 * @name SpecialtyMongoRepository
 * @description This class allows me to interact with the Specialty collection in the database.
 */
@injectable()
export class SpecialtyMongoRepository implements SpecialtyRepositoryAdapter {
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

    async find_all(): Promise<Specialty[]> {
        // Get all the EPS Documents
        const _DB = await this.db_handler.connect();
        const _RESULTS = await _DB.collection<SpecialtyDocument>('Specialty').find().toArray();
        
        if (!_RESULTS) {
            return [];
        }

        // Map the results to EPS entities
        return _RESULTS.map(SpecialtyMapper.from_document_to_domain);
    }
}