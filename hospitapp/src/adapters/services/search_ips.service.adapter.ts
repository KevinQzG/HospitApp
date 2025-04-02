import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";

/**
 * @interface
 * @name SearchIpsServiceAdapter
 * @description This interface should be implemented by the class that will filter, get and sort the IPSs.
 */
export default interface SearchIpsServiceAdapter {
	/**
	 * Gets all IPSs that are within a certain distance from the user and at least one of the specified specialties and EPSs.
	 * @async
	 * @param {number} latitude - Latitude of the user's location.
	 * @param {number} longitude - Longitude of the user's location.
	 * @param {number} max_distance - Maximum distance from the user's location in meters.
	 * @param {string[]} specialties - Specialties that the IPSs must have.
	 * @param {string[]} eps_names - EPSs that the IPSs must have.
	 * @param {number} page - The page number.
	 * @param {number} page_size - The number of results per page.
	 * @returns {Promise<{ results: IPS[]; total: number }>} The results is an array of IPSs that meet the specified criteria without surpassing the page size, and the total is the total number of IPSs that meet the specified criteria.
	 */
	filterIps(
		longitude: number | null,
		latitude: number | null,
		max_distance: number | null,
		specialties: string[],
		eps_names: string[],
		page: number,
		page_size: number
	): Promise<{ results: IpsResponse[]; total: number }>;

	/**
	 * Gets an IPS by its name.
	 *
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @returns {Promise<IpsResponse | null>} The IPS with the specified name, or null if it does not exist.
	 */
	getIpsByName(name: string): Promise<IpsResponse | null>;

	/**
	 * Gets an IPS by its name with reviews.
	 *
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @returns {Promise<{ ips: IpsResponse | null; reviewsResult: { reviews: ReviewResponse[]; total: number } }>} The IPS with the specified name and its reviews, or null if it does not exist.
	 */
	getIpsByNameWithReviews(
		name: string,
		page: number,
		pageSize: number
	): Promise<{
		ips: IpsResponse | null;
		reviewsResult: { reviews: ReviewResponse[]; total: number };
	}>;
}
