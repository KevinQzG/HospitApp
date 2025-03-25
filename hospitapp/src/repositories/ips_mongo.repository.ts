import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import IpsRepositoryAdapter from "@/adapters/ips_repository.adapter";
import { TYPES } from "@/adapters/types";
import { IpsDocument } from "@/models/ips.interface";
import { Ips } from "@/models/ips";
import type DBAdapter from "@/adapters/db.adapter";
import { IpsPipelineBuilder } from "./builders/ips.pipeline.builder";
import { IpsMapper } from "@/utils/mappers/ips_mapper";
import { AggregationResult } from "./ips_mongo.repository.interfaces";

/**
 * @class
 * @name IpsRepository
 * @description This class allows me to interact with the IPS collection in the database.
 */
@injectable()
export class IpsMongoRepository implements IpsRepositoryAdapter {
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

    async findAllByDistanceSpecialtyEps(
        longitude: number | null,
        latitude: number | null,
        maxDistance: number | null,
        specialties: string[],
        epsNames: string[],
        page: number = 1,
        pageSize: number = 10
    ): Promise<{ results: Ips[]; total: number }> {
        // Build the pipeline
        const PIPELINE = new IpsPipelineBuilder()
            .addGeoStage(longitude, latitude, maxDistance)
            .matchesSpecialties(specialties)
            .matchesEps(epsNames)
            .withPagination(page, pageSize)
            .build();

        // Execute the pipeline
        const DB = await this.dbHandler.connect();
        const AGGREGATION_RESULT = await DB.collection<IpsDocument>('IPS')
            .aggregate<AggregationResult>(PIPELINE).next();
        
        // If no results, return an empty array
        if (!AGGREGATION_RESULT) {
            return { results: [], total: 0 };
        }

        // Extract the results and total count
        const RESULTS = AGGREGATION_RESULT.data ?? [];
        const TOTAL = AGGREGATION_RESULT.metadata?.[0]?.total ?? 0;

        // Convert the IPS document to a IPS entity and return the results
        return {
            results: RESULTS.map(IpsMapper.fromDocumentToDomain),
            total: TOTAL
        };
    }

    async findByName(name: string): Promise<Ips | null> {
        // Build the pipeline
        const PIPELINE = new IpsPipelineBuilder()
            .addMatchNameStage(name)
            .withEps()
            .withSpecialties()
            .build();

        // Execute the pipeline
        const DB = await this.dbHandler.connect();
        const AGGREGATION_RESULT = await DB.collection<IpsDocument>('IPS')
            .aggregate<IpsDocument>(PIPELINE).next();

        // If no results, return null
        if (!AGGREGATION_RESULT) {
            return null;
        }

        // Convert the IPS document to a IPS entity
        return IpsMapper.fromDocumentToDomain(AGGREGATION_RESULT);
    }
}