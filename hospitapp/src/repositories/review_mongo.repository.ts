import { injectable, inject } from "inversify";
import { Db } from "mongodb";
import SpecialtyRepositoryAdapter from "@/adapters/specialty_repository.adapter";
import { TYPES } from "@/adapters/types";
import { SpecialtyDocument } from "@/models/specialty.interface";
import { Review } from "@/models/review.interface";
import type DBAdapter from "@/adapters/db.adapter";
import { SpecialtyMapper } from "@/utils/mappers/specialty_mapper";
import { PipelineBuilder } from "./builders/pipeline.builder";

/**
 * @class
 * @name SpecialtyMongoRepository
 * @description This class allows me to interact with the Specialty collection in the database.
 */
@injectable()
export class ReviewMongoRepository {
    /**
     * @constructor
     * @param {DBAdapter} dbHandler - The database handler.
     * @returns {void}
     * @description Creates an instance of the ReviewMongoRepository class.
     * @throws {Error} If the database handler is null.
     * @throws {Error} If the database connection fails.
     */
    constructor(
        @inject(TYPES.DBAdapter) private dbHandler: DBAdapter<Db>
    ) { }

    async findAll(): Promise<Review[]> {
        const PIPELINE = new PipelineBuilder().addSortStage({ name: 1 }).build();
        // Get all the EPS Documents
        const DB = await this.dbHandler.connect();
        const RESULTS = await DB.collection<ReviewDocument>('Specialty').aggregate<SpecialtyDocument>(PIPELINE).toArray();
        
        if (!RESULTS) {
            return [];
        }

        // Map the results to EPS entities
        return RESULTS.map(SpecialtyMapper.fromDocumentToDomain);
    }
}