import { Ips } from "@/models/ips";

/**
 * @interface
 * @name IpsRepositoryAdapter
 * @description This interface should be implemented by the IPS repository.
 */
export default interface IpsRepositoryAdapter {
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
	 * @returns {Promise<{ results: Ips[]; total: number }>} The IPSs that meet the specified criteria.
	 */
	findAllByDistanceSpecialtyEps(
		longitude: number | null,
		latitude: number | null,
		max_distance: number | null,
		specialties: string[],
		eps_names: string[],
		page: number,
		page_size: number
	): Promise<{ results: Ips[]; total: number }>;

	/**
	 * Gets the IPS with the specified name.
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @returns {Promise<Ips | null>} The IPS with the specified name, or null if no IPS was found.
	 */
	findByName(name: string): Promise<Ips | null>;
}
