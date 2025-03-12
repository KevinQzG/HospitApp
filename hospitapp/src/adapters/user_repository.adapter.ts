import {User} from '@/models/user';

/**
 * @interface
 * @name UserRepositoryAdapter
 * @description This interface should be implemented by the IPS repository.
 */

export default interface UserRepositoryAdapter {

    /**
     * Gets the USER with the specified email.
     * @async
     * @param {string} email - The email of the USER.
     * @returns {Promise<Ips | null>} The IPS with the specified email, or null if no IPS was found.
     */
    
    findUserByEmail(email: string): Promise<User | null>;

    /**
     * Creates a new USER.
     * @async 
     * @param {User} user - The USER to create.
     * @returns {Promise<boolean>} A promise that resolves when the USER is created.
     */

    createUser(eps: string, email: string, password: string, role: string, phone: string): Promise<boolean>;

}    