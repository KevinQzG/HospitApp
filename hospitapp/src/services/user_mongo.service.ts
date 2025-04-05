import { injectable, inject } from "inversify";
import { TYPES } from "@/adapters/types";
import type UserRepositoryAdapter from "@/adapters/repositories/user_repository.adapter";
import UserServiceAdapter from "@/adapters/services/user.service.adapter";

/**
 * @class
 * @name UserMongoService
 * @description This class contains the logic to interact with the user collection in the database.
 */
@injectable()
export class UserMongoService implements UserServiceAdapter {
	/**
	 * @constructor
	 * @param {EPSRepositoryAdapter} userRepository - The repository handler for Users.
	 * @returns {void}
	 * @description Creates an instance of the UserMongoService class.
	 */
	constructor(
		@inject(TYPES.UserRepositoryAdapter)
		private userRepository: UserRepositoryAdapter
	) {}

	async verifyUserRole(userEmail: string, role: string): Promise<boolean> {
		try {
			const user = await this.userRepository.findUserByEmail(userEmail);
			if (!user) {
				return false;
			}
			return user.getRole() === role;
		} catch (error) {
			return false;
		}
	}
}
