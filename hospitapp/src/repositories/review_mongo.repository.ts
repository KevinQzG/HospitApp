import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import { TYPES } from "@/adapters/types";
import { ReviewDocument } from "@/models/review.interface";
import { Review } from "@/models/review";
import type DBAdapter from "@/adapters/db.adapter";
import { ReviewMapper } from "@/utils/mappers/review_mapper";
import { PipelineBuilder } from "./builders/pipeline.builder";
import { AggregationResult } from "./review_mongo.repository.interfaces";
import ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";

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

	/**
	 * This method returns the base pipeline builder for the findAll method.
	 * @method
	 * @private
	 * @param ipsId - The ID of the IPS to filter by.
	 * @returns {PipelineBuilder} The pipeline builder instance.
	 */
	private baseFindAllPipelineBuilder(ipsId?: ObjectId): PipelineBuilder {
		let pipelineBuilder = new PipelineBuilder();

		if (ipsId) {
			// Add a match stage to filter by userId
			pipelineBuilder = pipelineBuilder.addMatchStage({
				ips: new ObjectId(ipsId),
			});
		}

		return pipelineBuilder
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
			});
	}

	async findAllWithPagination(
		page: number,
		pageSize: number,
		ipsId?: ObjectId
	): Promise<{ results: Review[]; total: number }> {
		// Build the pipeline
		const PIPELINE = this.baseFindAllPipelineBuilder(ipsId)
			.addPagination(page, pageSize)
			.build();

		// Get all the Reviews Documents
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

	async findAll(ipsId?: ObjectId): Promise<Review[]> {
		// Build the pipeline
		const PIPELINE = this.baseFindAllPipelineBuilder(ipsId).build();

		// Get all the Reviews Documents
		const DB = await this.dbHandler.connect();
		const REVIEWS = await DB.collection<ReviewDocument>("Review")
			.aggregate<ReviewDocument>(PIPELINE)
			.toArray();

		if (!REVIEWS) {
			return [];
		}

		return REVIEWS.map(ReviewMapper.fromDocumentToDomain);
	}

	async create(review: Review): Promise<ObjectId | null> {
		const DB = await this.dbHandler.connect();

		const REVIEW_DOCUMENT = review.toObject();

		delete REVIEW_DOCUMENT.userEmail;

		const INSERTED_REVIEW = await DB.collection<ReviewDocument>(
			"Review"
		).insertOne(REVIEW_DOCUMENT);

		if (!INSERTED_REVIEW) {
			return null;
		}

		return INSERTED_REVIEW.insertedId;
	}

	async update(review: Review): Promise<Review | null> {
		const DB = await this.dbHandler.connect();

		const UPDATED_REVIEW = await DB.collection<ReviewDocument>(
			"Review"
		).findOneAndUpdate(
			{ _id: review.getId() },
			{
				$set: {
					rating: review.getRating(),
					comments: review.getComments(),
					ips: review.getIps(),
					user: review.getUser(),
				},
			},
			{ returnDocument: "after" }
		);

		if (!UPDATED_REVIEW) {
			return null;
		}

		return ReviewMapper.fromDocumentToDomain(UPDATED_REVIEW);
	}

	async delete(id: ObjectId): Promise<boolean> {
		const DB = await this.dbHandler.connect();

		const DELETED_REVIEW = await DB.collection<ReviewDocument>(
			"Review"
		).deleteOne({
			_id: id,
		});

		if (!DELETED_REVIEW) {
			return false;
		}

		return DELETED_REVIEW.deletedCount === 1;
	}
}
