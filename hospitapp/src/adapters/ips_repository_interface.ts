import { IPS } from '@/models/ips';

/**
 * @interface
 * @name IpsRepositoryInterface
 * @description This interface should be implemented by the IPS repository.
 */
export default interface IpsRepositoryInterface {
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
     * @returns {Promise<IPS[]>} The IPSs that meet the specified criteria.
     */
    find_all_by_distance_specialty_eps(longitude: number, latitude: number, max_distance: number, specialties: string[], eps_names: string[], page: number, page_size: number): Promise<{ results: IPS[]; total: number }>;

    /**
     * Gets the IPS with the specified id.
     * @async
     * @param {string} id - The id of the IPS.
     * @returns {Promise<IPS | null>} The IPS with the specified id, or null if no IPS was found.
     */
    find_by_id(id: string): Promise<IPS | null>;
}