import { injectable, inject } from "inversify";
import { Db, ObjectId } from "mongodb";
import IpsRepositoryAdapter from "@/adapters/repositories/ips_repository.adapter";
import { TYPES } from "@/adapters/types";
import { IpsDocument } from "@/models/ips.interface";
import { Ips } from "@/models/ips";
import type DBAdapter from "@/adapters/db.adapter";
import { IpsPipelineBuilder } from "./builders/ips_pipeline.builder";
import { IpsMapper } from "@/utils/mappers/ips_mapper";
import { AggregationResult } from "./ips_mongo.repository.interfaces";
import { SortCriteria } from "./review_mongo.repository.interfaces";

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
	constructor(@inject(TYPES.DBAdapter) private dbHandler: DBAdapter<Db>) {}



	 async create(ips: Ips): Promise<ObjectId | null> {
		const DB = await this.dbHandler.connect();
		
		// @ts-expect-error because ips is not a IpsDocument and don't act like that act as an IPS
		const INSERTED_REVIEW = await DB.collection<IpsDocument>("IPS").insertOne(ips);

		if (!INSERTED_REVIEW) {
			return null;
		}

		return INSERTED_REVIEW.insertedId;
	}

	async update(id: ObjectId, ips: Ips): Promise<boolean | null> {
		const DB = await this.dbHandler.connect();

		// Editing a IPS	
		// @ts-expect-error becuase i cannot remove IP FROM IPS so i doesn't affect at all
		const INSERTED_DOCUMENT = await DB.collection<IpsDocument>("IPS").updateOne({_id: new ObjectId(id) }, { $set: ips});
		console.log("testing something", INSERTED_DOCUMENT);
		if (!INSERTED_DOCUMENT) {
			return null;
		}

		return INSERTED_DOCUMENT.acknowledged;
	}
	async delete(id: ObjectId): Promise<boolean> {
		const DB = await this.dbHandler.connect();
		const IPS_DOCUMENT = await DB.collection<IpsDocument>("IPS").deleteOne({ _id: id });
		if (!IPS_DOCUMENT) {
			return false;
		}

		return IPS_DOCUMENT.acknowledged;
	}

	private getPipelineBuilder(sorts: SortCriteria[], hasReviews: boolean, latitude: number | null, longitude: number | null, maxDistance: number | null, town: string | null): IpsPipelineBuilder {
		let pipelineBuilder = new IpsPipelineBuilder().addGeoStage(longitude, latitude, maxDistance);
		pipelineBuilder = pipelineBuilder.addRating();
		pipelineBuilder = pipelineBuilder.addTotalReviews();

		if (hasReviews) {
			pipelineBuilder = pipelineBuilder.hasReviews();
		}
		if (town) {
			pipelineBuilder = pipelineBuilder.addMatchStage({ town: town });
		}

		const SORT_OBJECT: { [key: string]: number } = {};

		SORT_OBJECT["promotion"] = -1;

		for (const SORT of sorts) {
			SORT_OBJECT[SORT.field] = SORT.direction;
		}

		SORT_OBJECT["town"] = 1;
		SORT_OBJECT["name"] = 1;

		pipelineBuilder = pipelineBuilder.addSortStage(SORT_OBJECT);

		return pipelineBuilder;
	}

	async findAllByDistanceSpecialtyEpsWithPagination(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		sorts: SortCriteria[],
		page: number = 1,
		pageSize: number = 10,
		hasReviews: boolean = false,
	): Promise<{ results: Ips[]; total: number }> {
		// Build the pipeline
		const PIPELINE = this.getPipelineBuilder(sorts, hasReviews, latitude, longitude, maxDistance, town)
			.matchesSpecialties(specialties)
			.matchesEps(epsNames)
			.addPagination(page, pageSize)
			.build();

		// Execute the pipeline
		const DB = await this.dbHandler.connect();
		const AGGREGATION_RESULT = await DB.collection<IpsDocument>("IPS")
			.aggregate<AggregationResult>(PIPELINE)
			.next();

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
			total: TOTAL,
		};
	}

	async findAllByDistanceSpecialtyEps(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		sorts: SortCriteria[],
		hasReviews: boolean = false
	): Promise<Ips[]> {
		// Build the pipeline
		const PIPELINE = this.getPipelineBuilder(sorts, hasReviews, latitude, longitude, maxDistance, town)
			.matchesSpecialties(specialties)
			.matchesEps(epsNames)
			.build();

		// Execute the pipeline
		const DB = await this.dbHandler.connect();
		const AGGREGATION_RESULT = await DB.collection<IpsDocument>("IPS")
			.aggregate<IpsDocument>(PIPELINE)
			.toArray();

		// If no results, return an empty array
		if (!AGGREGATION_RESULT) {
			return [];
		}

		// Convert the IPS document to a IPS entity and return the results
		return AGGREGATION_RESULT.map(IpsMapper.fromDocumentToDomain);
	}

	async findByName(name: string): Promise<Ips | null> {
		// Build the pipeline
		const PIPELINE = new IpsPipelineBuilder()
			.addMatchStage({ name: name })
			.addRating()
			.withEps()
			.withSpecialties()
			.addFinalProjection()
			.build();

		// Execute the pipeline
		const DB = await this.dbHandler.connect();
		const AGGREGATION_RESULT = await DB.collection<IpsDocument>("IPS")
			.aggregate<IpsDocument>(PIPELINE)
			.next();

		// If no results, return null
		if (!AGGREGATION_RESULT) {
			return null;
		}

		// Convert the IPS document to a IPS entity
		return IpsMapper.fromDocumentToDomain(AGGREGATION_RESULT);
	}

	async findAllWithPagination(
		sorts: SortCriteria[],
		page: number,
		pageSize: number
	): Promise<{ results: Ips[]; total: number }> {
		// Build the pipeline
		const PIPELINE = this.getPipelineBuilder(sorts, false, null, null, null, null)
			.addPagination(page, pageSize)
			.build();

		// Get all the EPS Documents
		const DB = await this.dbHandler.connect();
		const AGGREGATION_RESULT = await DB.collection<IpsDocument>("IPS")
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
			results: RESULTS.map(IpsMapper.fromDocumentToDomain),
			total: TOTAL,
		};
	}

	async findAll(sorts: SortCriteria[]): Promise<Ips[]> {
		const PIPELINE = this.getPipelineBuilder(sorts, false, null, null, null, null)
			.build();

		const DB = await this.dbHandler.connect();
		const IPS_DOCUMENTS = await DB.collection<IpsDocument>("IPS")
			.aggregate<IpsDocument>(PIPELINE)
			.toArray();

		if (!IPS_DOCUMENTS) {
			return [];
		}

		return IPS_DOCUMENTS.map(IpsMapper.fromDocumentToDomain);
	}	
}
