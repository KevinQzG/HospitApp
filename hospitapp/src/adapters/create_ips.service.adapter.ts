import { Ips } from '@/models/ips';

/**
 * @interface
 * @name IpsRepositoryAdapter
 * @description This interface should be implemented by the IPS repository.
 */
export default interface CreateIpsServiceAdapter {

    /**
     * Creates a new IPS.
     * @async
     * @param {Ips} ips - The IPS data to create.
     * @returns {Promise<Ips>} The created IPS.
     */
    create(ips: Ips): Promise<Ips | null>;
}