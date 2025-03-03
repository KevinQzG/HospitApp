import { Specialty } from '@/models/specialty';

/**
 * @interface
 * @name SpecialtyRepositoryAdapter
 * @description This interface should be implemented by the Specialty repository.
 */
export default interface SpecialtyRepositoryAdapter {
    /**
     * Gets all specialties from the database, it returns an empty array there is not specialties
     * @async
     * @returns {Promise<Specialty[]>} 
     */
    find_all(): Promise<Specialty[]>;
}