import { Review } from "@/models/review";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";
import { ObjectId } from "mongodb";

/**
 * @interface
 * @name ReviewRepositoryAdapter
 * @description This interface should be implemented by the Review repository.
 */
export default interface ReviewRepositoryAdapter {
	/**
	 * Gets all Reviews with pagination.
	 * @async
	 * @param {number} page - The page number.
	 * @param {number} pageSize - The number of results per page.
	 * @param {SortCriteria[]} sorts - The sorting criteria.
	 * @param {ObjectId} ipsId - The ID of the IPS to filter by (optional).
	 * @param {number} ratingFilter - The rating filter to apply (optional).
	 * @returns {Promise<{ results: Review[]; total: number }>} The Reviews that meet the specified criteria.
	 */
	findAllWithPagination(
		page: number,
		pageSize: number,
		sorts: SortCriteria[],
		ipsId?: ObjectId,
		ratingFilter?: number
	): Promise<{ results: Review[]; total: number }>;

	/**
	 * Gets all Reviews.
	 * @async
	 * @param {SortCriteria} sorts - The sorting criteria.
	 * @param {ObjectId} ipsId - The ID of the IPS to filter by (optional).
	 * @param {number} ratingFilter - The rating filter to apply (optional).
	 * @returns {Promise<Review[]>} The Reviews that meet the specified criteria.
	 */
	findAll(
		sorts: SortCriteria[],
		ipsId?: ObjectId,
		ratingFilter?: number
	): Promise<Review[]>;

	/**
	 * Creates a new Review.
	 * @async
	 * @param {Review} review - The Review to create.
	 * @returns {Promise<ObjectId | null>} The ID of the created Review.
	 */
	create(review: Review): Promise<ObjectId | null>;

	/**
	 * Deletes a Review by ID.
	 * @async
	 * @param {ObjectId} id - The ID of the Review to delete.
	 * @returns {Promise<boolean>} True if the Review was deleted, false otherwise.
	 */
	delete(id: ObjectId): Promise<boolean>;

	/**
	 * Updates a Review.
	 * @async
	 * @param {Review} review - The Review to update.
	 * @returns {Promise<Review | null>} The updated Review, or null if not found.
	 */
	update(review: Review): Promise<Review | null>;

	/**
	 * Finds a Review by ID.
	 * @async
	 * @param {ObjectId} id - The ID of the Review to find.
	 * @returns {Promise<Review | null>} The found Review, or null if not found.
	 */
	findById(id: ObjectId): Promise<Review | null>;
}
