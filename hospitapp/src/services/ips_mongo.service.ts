import { injectable, inject } from "inversify";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";
import type IpsRepositoryAdapter from "@/adapters/repositories/ips_repository.adapter";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import type ReviewRepositoryAdapter from "@/adapters/repositories/review_repository.adapter";

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

	async filterIpsWithPagination(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		page: number,
		pageSize: number,
		town: string | null
	): Promise<{ results: IpsResponse[]; total: number }> {
		const RESULTS =
			await this.ipsRepository.findAllByDistanceSpecialtyEpsWithPagination(
				longitude,
				latitude,
				maxDistance,
				specialties,
				epsNames,
				page,
				pageSize,
				town
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
		town: string | null
	): Promise<IpsResponse[]> {
		const RESULTS = await this.ipsRepository.findAllByDistanceSpecialtyEps(
			longitude,
			latitude,
			maxDistance,
			specialties,
			epsNames,
			town
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

	async getIpsByNameWithReviews(
		name: string,
		page: number,
		pageSize: number
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
				IPS.getId()
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
}
