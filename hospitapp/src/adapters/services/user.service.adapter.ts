/**
 * @interface
 * @name UserServiceAdapter
 * @description This interface should be implemented by the class that will handle users.
 */
export default interface UserServiceAdapter {
	/**
	 * Verifies if the user has the specified role.
	 * @param {string} userEmail - The email of the user to verify.
	 * @param {string} role - The role to verify.
	 * @async
	 * @returns {Promise<boolean>} True if the user has the role, false otherwise.
	 */
	verifyUserRole(userEmail: string, role: string): Promise<boolean>;
}
