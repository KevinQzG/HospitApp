import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import { TYPES } from "@/adapters/types";
import { ReviewDocument } from "@/models/review.interface";
import { Review } from "@/models/review";
import type DBAdapter from "@/adapters/db.adapter";
import { ReviewMapper } from "@/utils/mappers/review_mapper";
import { PipelineBuilder } from "./builders/pipeline.builder";
import { AggregationResult } from "./review_mongo.repository.interfaces";
import ReviewRepositoryAdapter from "@/adapters/review_repository.adapter";

/**
 * @class
 * @name SpecialtyMongoRepository
 * @description This class allows me to interact with the Specialty collection in the database.
 */
@injectable()
export class ReviewMongoRepository implements ReviewRepositoryAdapter {
	/**
	 * @constructor
	 * @param {DBAdapter} dbHandler - The database handler.
	 * @returns {void}
	 * @description Creates an instance of the ReviewMongoRepository class.
	 * @throws {Error} If the database handler is null.
	 * @throws {Error} If the database connection fails.
	 */
	constructor(@inject(TYPES.DBAdapter) private dbHandler: DBAdapter<Db>) {}

	async findAllWithPagination(
		page: number,
		pageSize: number,
		ipsId?: ObjectId
	): Promise<{ results: Review[]; total: number }> {
		let pipelineBuilder = new PipelineBuilder();

		if (ipsId) {
			// Add a match stage to filter by userId
			pipelineBuilder = pipelineBuilder.addMatchStage({
				ips: new ObjectId(ipsId),
			});
		}
		// Build the pipeline
		const PIPELINE = pipelineBuilder
			.addLookupStage("USERS", "user", "_id", "userObject")
			.addFieldsStage({
				userEmail: {
					$arrayElemAt: ["$userObject.email", 0],
				},
			})
			.addProjectStage({
				userObject: 0,
			})
			.addSortStage({
				rating: -1,
				userEmail: 1,
			})
			.addPagination(page, pageSize)
			.build();

		// Get all the EPS Documents
		const DB = await this.dbHandler.connect();
		const AGGREGATION_RESULT = await DB.collection<ReviewDocument>("Review")
			.aggregate<AggregationResult>(PIPELINE)
			.next();

		if (!AGGREGATION_RESULT) {
			return { results: [], total: 0 };
		}

		// Extract the results and total count
		const RESULTS = AGGREGATION_RESULT.data ?? [];
		const TOTAL = AGGREGATION_RESULT.metadata?.[0]?.total ?? 0;

		// Map the results to EPS entities
		return {
			results: RESULTS.map(ReviewMapper.fromDocumentToDomain),
			total: TOTAL,
		};
	}
}
