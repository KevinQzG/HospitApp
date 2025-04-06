import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import { TYPES } from "@/adapters/types";
import { ReviewDocument } from "@/models/review.interface";
import { Review } from "@/models/review";
import type DBAdapter from "@/adapters/db.adapter";
import { ReviewMapper } from "@/utils/mappers/review_mapper";
import { PipelineBuilder } from "./builders/pipeline.builder";
import {
	AggregationResult,
	SortCriteria,
} from "./review_mongo.repository.interfaces";
import ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";

/**
 * @class
 * @name ReviewMongoRepository
 * @description This class allows me to interact with the Review collection in the database.
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
	 * This method returns the base pipeline builder for the retrieving reviews method.
	 * @method
	 * @private
	 * @param ipsId - The ID of the IPS to filter by.
	 * @returns {PipelineBuilder} The pipeline builder instance.
	 */
	private basePipelineBuilder(
		sorts: SortCriteria[],
		ipsId?: ObjectId
	): PipelineBuilder {
		let pipelineBuilder = new PipelineBuilder();

		if (ipsId) {
			// Add a match stage to filter by userId
			pipelineBuilder = pipelineBuilder.addMatchStage({
				ips: new ObjectId(ipsId),
			});
		}

		pipelineBuilder = pipelineBuilder
			.addLookupStage("USERS", "user", "_id", "userObject")
			.addLookupStage("IPS", "ips", "_id", "ipsObject")
			.addFieldsStage({
				userEmail: {
					$arrayElemAt: ["$userObject.email", 0],
				},
				ipsName: {
					$arrayElemAt: ["$ipsObject.name", 0],
				},
			})
			.addProjectStage({
				userObject: 0,
				ipsObject: 0,
			});

		const SORT_OBJECT: { [key: string]: number } = {};

		for (const SORT of sorts) {
			SORT_OBJECT[SORT.field] = SORT.direction;
		}

		SORT_OBJECT["ipsName"] = 1;
		SORT_OBJECT["userEmail"] = 1;

		return pipelineBuilder.addSortStage(SORT_OBJECT);
	}

	async findAllWithPagination(
		page: number,
		pageSize: number,
		sorts: SortCriteria[],
		ipsId?: ObjectId
	): Promise<{ results: Review[]; total: number }> {
		// Build the pipeline
		const PIPELINE = this.basePipelineBuilder(sorts, ipsId)
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

	async findAll(sorts: SortCriteria[], ipsId?: ObjectId): Promise<Review[]> {
		// Build the pipeline
		const PIPELINE = this.basePipelineBuilder(sorts, ipsId).build();

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
		delete REVIEW_DOCUMENT.ipsName;

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
					createdAt: review.getCreatedAt(),
					lastUpdated: review.getLastUpdated(),
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

	async findById(id: ObjectId): Promise<Review | null> {
		const PIPELINE = this.basePipelineBuilder([])
			.addMatchStage({
				_id: id,
			})
			.build();
		const DB = await this.dbHandler.connect();

		const REVIEW_DOCUMENT = await DB.collection<ReviewDocument>("Review")
			.aggregate<ReviewDocument>(PIPELINE)
			.next();

		if (!REVIEW_DOCUMENT) {
			return null;
		}

		return ReviewMapper.fromDocumentToDomain(REVIEW_DOCUMENT);
	}
}
