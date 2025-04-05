import { injectable, inject } from "inversify";
import { TYPES } from "@/adapters/types";
import type ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";
import ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import { ReviewResponse } from "@/models/review.interface";
import { Review } from "@/models/review";
import { ObjectId } from "mongodb";

/**
 * @class
 * @name ReviewMongoService
 * @description This class contains the logic to interact with the review collection in the database.
 */
@injectable()
export class ReviewMongoService implements ReviewServiceAdapter {
	/**
	 * @constructor
	 * @param {SpecialtyRepositoryAdapter} reviewRepository - The repository handler for reviews.
	 * @returns {void}
	 * @description Creates an instance of the ReviewMongoService class.
	 */
	constructor(
		@inject(TYPES.ReviewRepositoryAdapter)
		private reviewRepository: ReviewRepositoryAdapter
	) {}

	async findAllWithPagination(
		page: number,
		pageSize: number,
		ipsId?: string
	): Promise<{ results: ReviewResponse[]; total: number }> {
		const { results: RESULTS, total: TOTAL } =
			await this.reviewRepository.findAllWithPagination(
				page,
				pageSize,
				new ObjectId(ipsId)
			);
		return {
			results: RESULTS.map((review) => review.toResponse()),
			total: TOTAL,
		};
	}

	async findAll(ipsId?: string): Promise<ReviewResponse[]> {
		const RESULTS = await this.reviewRepository.findAll(
			new ObjectId(ipsId)
		);
		return RESULTS.map((review) => review.toResponse());
	}

	async create(
		ips: string,
		user: string,
		rating: number,
		comments: string
	): Promise<string | null> {
		const REVIEW = new Review(
			undefined,
			new ObjectId(ips),
			new ObjectId(user),
			rating,
			comments
		);

		const ID = await this.reviewRepository.create(REVIEW);
		if (!ID) return null;
		console.log(ID);
		return ID.toHexString();
	}

	async update(
		id: string,
		ips: string,
		user: string,
		rating: number,
		comments: string
	): Promise<ReviewResponse | null> {
		const REVIEW = new Review(
			new ObjectId(id),
			new ObjectId(ips),
			new ObjectId(user),
			rating,
			comments
		);

		const UPDATED_REVIEW = await this.reviewRepository.update(REVIEW);
		if (!UPDATED_REVIEW) return null;
		return UPDATED_REVIEW.toResponse();
	}

	async delete(id: string): Promise<boolean> {
		const DELETED = await this.reviewRepository.delete(new ObjectId(id));

		return DELETED;
	}

	async findById(id: string): Promise<ReviewResponse | null> {
		if (ObjectId.isValid(id) === false) return null;
		const REVIEW = await this.reviewRepository.findById(new ObjectId(id));
		if (!REVIEW) return null;
		return REVIEW.toResponse();
	}
}
