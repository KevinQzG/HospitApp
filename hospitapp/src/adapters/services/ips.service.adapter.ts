import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";

/**
 * @interface
 * @name SearchIpsServiceAdapter
 * @description This interface should be implemented by the class that will filter, get and sort the IPSs.
 */
export default interface IpsServiceAdapter {
	/**
	 * Gets all IPSs that are within a certain distance from the user and at least one of the specified specialties and EPSs. With pagination.
	 * @async
	 * @param {number} latitude - Latitude of the user's location.
	 * @param {number} longitude - Longitude of the user's location.
	 * @param {number} maxDistance - Maximum distance from the user's location in meters.
	 * @param {string[]} specialties - Specialties that the IPSs must have.
	 * @param {string[]} epsNames - EPSs that the IPSs must have.
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @param {string | null} town - The town of the IPSs.
	 * @param {boolean} hasReviews - Whether to filter the IPSs that have reviews or not applied. (default: false)
	 * @returns {Promise<{ results: IPS[]; total: number }>} The results is an array of IPSs that meet the specified criteria without surpassing the page size, and the total is the total number of IPSs that meet the specified criteria.
	 */
	filterIpsWithPagination(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		page: number,
		pageSize: number,
		town: string | null,
		hasReviews?: boolean
	): Promise<{ results: IpsResponse[]; total: number }>;

	/**
	 * Gets all IPSs that are within a certain distance from the user and at least one of the specified specialties and EPSs. Without pagination.
	 * @async
	 * @param {number} latitude - Latitude of the user's location.
	 * @param {number} longitude - Longitude of the user's location.
	 * @param {number} maxDistance - Maximum distance from the user's location in meters.
	 * @param {string[]} specialties - Specialties that the IPSs must have.
	 * @param {string[]} epsNames - EPSs that the IPSs must have.
	 * @returns {Promise<IpsResponse[]>} The results is an array of IPSs that meet the specified criteria.
	 * @param {string | null} town - The town of the IPSs.
	 * @param {boolean} hasReviews - Whether to filter the IPSs that have reviews or not applied. (default: false)
	 * @returns {Promise<IpsResponse[]>} The results is an array of IPSs that meet the specified criteria.
	 */
	filterIps(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		hasReviews?: boolean
	): Promise<IpsResponse[]>;

	/**
	 * Gets an IPS by its name.
	 *
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @returns {Promise<IpsResponse | null>} The IPS with the specified name, or null if it does not exist.
	 */
	getIpsByName(name: string): Promise<IpsResponse | null>;

	/**
	 * Gets an IPS by its name with reviews and pagination.
	 *
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @param {SortCriteria[]} [sort] - The sorting criteria (optional).
	 * @returns {Promise<{ ips: IpsResponse | null; reviewsResult: { reviews: ReviewResponse[]; total: number } }>} The IPS with the specified name and its reviews, or null if it does not exist.
	 */
	getIpsByNameWithReviewsPagination(
		name: string,
		page: number,
		pageSize: number,
		sort?: SortCriteria[]
	): Promise<{
		ips: IpsResponse | null;
		reviewsResult: { reviews: ReviewResponse[]; total: number };
	}>;

	/**
	 * Gets an IPS by its name with reviews.
	 *
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @param {SortCriteria[]} [sort] - The sorting criteria (optional).
	 * @returns {Promise<{ ips: IpsResponse | null; reviewsResult: ReviewResponse[] }>} The IPS with the specified name and its reviews, or null if it does not exist.
	 */
	getIpsByNameWithReviews(
		name: string,
		sort?: SortCriteria[]
	): Promise<{
		ips: IpsResponse | null;
		reviewsResult: ReviewResponse[];
	}>
}
