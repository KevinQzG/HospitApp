import { ReviewResponse } from "@/models/review.interface";

/**
 * @interface
 * @name SpecialtyServiceAdapter
 * @description This interface should be implemented by the class that will CRUD reviews
 */
export default interface ReviewServiceAdapter {
	/**
	 * Gets all reviews from the database, it returns an empty array there is not reviews.
	 * @param {string} ipsId - The ID of the IPS to filter by (optional).
	 * @async
	 * @returns {Promise<Review[]>}
	 */
	findAll(ipsId?: string): Promise<ReviewResponse[]>;

	/**
	 * Gets all reviews from the database, it returns an empty array there is not reviews. It uses pagination.
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @param {string} ipsId - The ID of the IPS to filter by (optional).
	 * @async
	 * @returns {Promise<Review[]>}
	 */
	findAllWithPagination(
		page: number,
		pageSize: number,
		ipsId?: string
	): Promise<{ results: ReviewResponse[]; total: number }>;

	/**
	 * Creates a new review in the database.
	 * @param {string} ips - The ID of the IPS to filter by.
	 * @param {string} user - The ID of the user to filter by.
	 * @param {number} rating - The rating of the review.
	 * @param {string} comments - The comments of the review.
	 * @async
	 * @returns {Promise<string | null>}
	 */
	create(
		ips: string,
		user: string,
		rating: number,
		comments: string
	): Promise<string | null>;

	/**
	 * Updates a review in the database.
	 * @param {string} id - The ID of the review to update.
	 * @param {string} ips - The ID of the IPS to filter by.
	 * @param {string} user - The ID of the user to filter by.
	 * @param {number} rating - The rating of the review.
	 * @param {string} comments - The comments of the review.
	 * @async
	 * @returns {Promise<ReviewResponse | null>}
	 */
	update(
		id: string,
		ips: string,
		user: string,
		rating: number,
		comments: string
	): Promise<ReviewResponse | null>;

	/**
	 * Deletes a review in the database.
	 * @param {string} id - The ID of the review to delete.
	 * @async
	 * @returns {Promise<boolean>}
	 */
	delete(id: string): Promise<boolean>;

	/**
	 * Gets a review by ID from the database.
	 * @param {string} id - The ID of the review to get.
	 * @async
	 * @returns {Promise<ReviewResponse | null>}
	 */
	findById(id: string): Promise<ReviewResponse | null>;
}
