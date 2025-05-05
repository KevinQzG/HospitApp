import { injectable, inject } from "inversify";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";
import type IpsRepositoryAdapter from "@/adapters/repositories/ips_repository.adapter";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import type ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";
import { Ips } from "@/models/ips";
import { ObjectId } from "mongodb";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";

/**
 * @class
 * @name IpsMongoService
 * @description This class contains the logic to interact with the IPS collection in the database.
 */
@injectable()
export class IpsMongoService implements IpsServiceAdapter {
	/**
	 * @constructor
	 * @param {IpsRepositoryAdapter} ipsRepository - The repository handler for IPSs.
	 * @param {ReviewRepositoryAdapter} reviewRepository - The repository handler for reviews.
	 * @returns {void}
	 * @description Creates an instance of the FilterAndSortIpsService class.
	 * @throws {Error} If the database handler is null.
	 * @throws {Error} If the database connection fails.
	 */
	constructor(
		@inject(TYPES.IpsRepositoryAdapter)
		private ipsRepository: IpsRepositoryAdapter,
		@inject(TYPES.ReviewRepositoryAdapter)
		private reviewRepository: ReviewRepositoryAdapter
	) {}

	async create(ips: Ips): Promise<ObjectId | null> {
		const ID = await this.ipsRepository.create(ips);
		if (!ID) return null;
		return ID;
	}

	async update(id: ObjectId, ips: Ips): Promise<boolean | null> {
		const RESULT = await this.ipsRepository.update(id, ips);
		if (!RESULT) return null;
		return RESULT;
	}

	async delete(id: string): Promise<boolean> {
		const DELETED = await this.ipsRepository.delete(new ObjectId(id));
		return DELETED;
	}

	async filterIpsWithPagination(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		page: number,
		pageSize: number,
		town: string | null,
		hasReviews: boolean = false,
		sort?: SortCriteria[]
	): Promise<{ results: IpsResponse[]; total: number }> {
		const RESULTS =
			await this.ipsRepository.findAllByDistanceSpecialtyEpsWithPagination(
				longitude,
				latitude,
				maxDistance,
				specialties,
				epsNames,
				town,
				sort ?? [
					{ field: "promotion", direction: -1 },
					{ field: "distance", direction: 1 },
					{ field: "rating", direction: -1 },
				],
				page,
				pageSize,
				hasReviews
			);

		return {
			results: RESULTS.results.map((ips) => {
				return ips.toResponse();
			}),
			total: RESULTS.total,
		};
	}

	async filterIps(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		hasReviews: boolean = false,
		sort?: SortCriteria[]
	): Promise<IpsResponse[]> {
		const RESULTS = await this.ipsRepository.findAllByDistanceSpecialtyEps(
			longitude,
			latitude,
			maxDistance,
			specialties,
			epsNames,
			town,
			sort ?? [
				{ field: "promotion", direction: -1 },
				{ field: "distance", direction: 1 },
				{ field: "rating", direction: -1 },
			],
			hasReviews
		);

		return RESULTS.map((ips) => {
			return ips.toResponse();
		});
	}

	async getIpsByName(name: string): Promise<IpsResponse | null> {
		const IPS = await this.ipsRepository.findByName(name);
		if (!IPS) {
			return null;
		}
		return IPS.toResponse();
	}

	async getIpsByNameWithReviewsPagination(
		name: string,
		page: number,
		pageSize: number,
		sort?: SortCriteria[],
		ratingFilter?: number
	): Promise<{
		ips: IpsResponse | null;
		reviewsResult: { reviews: ReviewResponse[]; total: number };
	}> {
		const IPS = await this.ipsRepository.findByName(name);
		if (!IPS) {
			return { ips: null, reviewsResult: { reviews: [], total: 0 } };
		}

		const REVIEWS_RESULT =
			await this.reviewRepository.findAllWithPagination(
				page,
				pageSize,
				sort ?? [{ field: "rating", direction: -1 }],
				IPS.getId(),
				ratingFilter
			);
		const REVIEWS = REVIEWS_RESULT.results.map((review) => {
			return review.toResponse();
		});

		return {
			ips: IPS.toResponse(),
			reviewsResult: {
				reviews: REVIEWS,
				total: REVIEWS_RESULT.total,
			},
		};
	}

	async getIpsByNameWithReviews(
		name: string,
		sort?: SortCriteria[],
		ratingFilter?: number
	): Promise<{
		ips: IpsResponse | null;
		reviewsResult: ReviewResponse[];
	}> {
		const IPS = await this.ipsRepository.findByName(name);
		if (!IPS) {
			return { ips: null, reviewsResult: [] };
		}

		const REVIEWS_RESULT = await this.reviewRepository.findAll(
			sort ?? [{ field: "rating", direction: -1 }],
			IPS.getId(),
			ratingFilter
		);
		const REVIEWS = REVIEWS_RESULT.map((review) => {
			return review.toResponse();
		});

		return {
			ips: IPS.toResponse(),
			reviewsResult: REVIEWS,
		};
	}
}
