import { Ips } from "@/models/ips";
import { ObjectId } from "mongodb";

/**
 * @interface
 * @name IpsRepositoryAdapter
 * @description This interface should be implemented by the IPS repository.
 */
export default interface IpsRepositoryAdapter {
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
	 * @param {string} town - The town of the IPSs.
	 * @param {boolean} hasReviews - Whether to filter the IPSs that have reviews or not applied.
	 * @returns {Promise<{ results: Ips[]; total: number }>} The IPSs that meet the specified criteria.
	 */
	findAllByDistanceSpecialtyEpsWithPagination(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		page?: number,
		pageSize?: number,
		hasReviews?: boolean
	): Promise<{ results: Ips[]; total: number }>;

	/**
	 * Gets all IPSs that are within a certain distance from the user and at least one of the specified specialties and EPSs.
	 * @async
	 * @param {number} latitude - Latitude of the user's location.
	 * @param {number} longitude - Longitude of the user's location.
	 * @param {number} maxDistance - Maximum distance from the user's location in meters.
	 * @param {string[]} specialties - Specialties that the IPSs must have.
	 * @param {string[]} epsNames - EPSs that the IPSs must have.
	 * @param {string} town - The town of the IPSs.
	 * @param {boolean} hasReviews - Whether to filter the IPSs that have reviews or not applied.
	 * @returns {Promise<Ips[]>} The IPSs that meet the specified criteria.
	 */
	findAllByDistanceSpecialtyEps(
		longitude: number | null,
		latitude: number | null,
		maxDistance: number | null,
		specialties: string[],
		epsNames: string[],
		town: string | null,
		hasReviews?: boolean
	): Promise<Ips[]>;

	/**
	 * Gets the IPS with the specified name.
	 * @async
	 * @param {string} name - The name of the IPS.
	 * @returns {Promise<Ips | null>} The IPS with the specified name, or null if no IPS was found.
	 */
	findByName(name: string): Promise<Ips | null>;

	/**
	 * Gets all IPSs with pagination.
	 * @async
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @returns {Promise<{ results: Ips[]; total: number }>} The IPSs that meet the specified criteria.
	 */
	findAllWithPagination(
		page: number,
		pageSize: number
	): Promise<{ results: Ips[]; total: number }>;

	/**
	 * Gets all IPSs.
	 * @async
	 * @returns {Promise<Ips[]>} The IPSs that meet the specified criteria.
	 */
	findAll(): Promise<Ips[]>;

	/**
	 * Creates a new IPS.
	 * @async
	 * @param {Ips} ips - The IPS data to create.
	 * @returns {Promise<Ips>} The created IPS.
	 */
	create(ips: Ips): Promise<ObjectId | null>;

	/**
	 * Updates an existing IPS.
	 * @async
	 * @param {ObjectId} id - The ID of the IPS to update.
	 * @param {Ips} ips - The updated IPS data.
	 * @returns {Promise<Ips>} The updated IPS.
	 */
	update(id: ObjectId, ips: Ips): Promise<ObjectId | null>;

	/**
	 * Deletes an IPS by ID.
	 * @async
	 * @param {string} id - The ID of the IPS to delete.
	 * @returns {Promise<Ips>} The deleted IPS.
	 */
	delete(id: ObjectId): Promise<boolean>;
}
