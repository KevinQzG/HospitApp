import { Eps } from '@/models/eps';

/**
 * @interface
 * @name EpsRepositoryAdapter
 * @description This interface should be implemented by the IPS repository.
 */
export default interface EpsRepositoryAdapter {
    /**
     * Gets all EPSs from the database, it returns an empty array there is not EPSs
     * @async
     * @returns {Promise<Eps[]>} 
     */
    findAll(): Promise<Eps[]>;
}