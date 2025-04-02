import { Review } from "@/models/review";
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
   * @param {ObjectId} ipsId - The ID of the IPS to filter by (optional).
   * @returns {Promise<{ results: Review[]; total: number }>} The Reviews that meet the specified criteria.
   */
  findAllWithPagination(
    page: number,
    pageSize: number,
    ipsId?: ObjectId
  ): Promise<{ results: Review[]; total: number }>;
}
