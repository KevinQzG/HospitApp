import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import EpsRepositoryAdapter from "@/adapters/eps_repository.adapter";
import { TYPES } from "@/adapters/types";
import { EpsDocument } from "@/models/eps.interface";
import { Eps } from "@/models/eps";
import type DBAdapter from "@/adapters/db.adapter";
import { EpsMapper } from "@/utils/mappers/eps_mapper";
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
     * @param {DBAdapter} dbHandler - The database handler.
     * @returns {void}
     * @description Creates an instance of the IpsMongoRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(TYPES.DBAdapter) private dbHandler: DBAdapter<Db>
    ) { }

    async findAll(): Promise<Eps[]> {
        // Get all the EPS Documents
        const DB = await this.dbHandler.connect();
        const RESULTS = await DB.collection<EpsDocument>('EPS').find().toArray();
        
        if (!RESULTS) {
            return [];
        }

        // Map the results to EPS entities
        return RESULTS.map(EpsMapper.fromDocumentToDomain);
    }
}