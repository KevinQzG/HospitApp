import { IPSDocument } from '@/models/ips.interface';
import { SpecialtyDocument } from '@/models/specialty.interface';
import { EPSDocument } from '@/models/eps.interface';

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
    filter(longitude: number, latitude: number, max_distance: number, specialties: string[], eps_names: string[], page: number, page_size: number): Promise<{ results: IPSDocument[]; total: number }>;


    /**
     * Gets all the specialties from the database.
     * @async
     * @returns {Promise<Specialty[]>} The specialties from the database.
     */
    get_specialties(): Promise<SpecialtyDocument[]>;

    /**
     * Gets all the EPSs from the database.
     * @async
     * @returns {Promise<EPS[]>} The EPSs from the database.
     */
    get_eps(): Promise<EPSDocument[]>;
}