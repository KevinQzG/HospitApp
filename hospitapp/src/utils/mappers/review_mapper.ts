import { ObjectId } from "mongodb";
import { ReviewDocument, ReviewResponse } from "@/models/review.interface";
import { Review } from "@/models/review";

/**
 * Class that allows to map Review entities from domain to document and vice versa.
 * @class ReviewMapper
 */
export class ReviewMapper {
	/**
	 * Maps an Review document to an Review entity.
	 * @param {ReviewDocument} raw - The Review document.
	 * @returns {Review} The Review entity.
	 */
	static fromDocumentToDomain(raw: ReviewDocument): Review {
		return new Review(
			raw._id,
			raw.user,
			raw.ips,
			raw.rating,
			raw.comments,
			raw.userEmail
		);
	}

	/**
	 * Maps an Review entity to an Review document.
	 * @param {Review} Review - The Review entity.
	 * @returns {ReviewDocument} The Review document.
	 */
	static fromDomainToDocument(Review: Review): ReviewDocument {
		return {
			_id: Review.getId(),
			user: Review.getUser(),
			ips: Review.getIps(),
			rating: Review.getRating(),
			comments: Review.getComments(),
			userEmail: Review.getUserEmail(),
		};
	}

	/**
	 * Maps an Review response to an Review entity.
	 * @param {ReviewResponse} raw - The Review response.
	 * @returns {Review} The Review entity.
	 */
	static fromResponseToDomain(raw: ReviewResponse): Review {
		return new Review(
			new ObjectId(raw._id),
			new ObjectId(raw.user),
			new ObjectId(raw.ips),
			raw.rating,
			raw.comments,
			raw.userEmail
		);
	}

	/**
	 * Maps an Review entity to an Review response.
	 * @param {Review} Review - The Review entity.
	 * @returns {ReviewResponse} The Review response.
	 */
	static fromDomainToResponse(Review: Review): ReviewResponse {
		return {
			_id: Review.getId().toHexString(),
			user: Review.getUser().toHexString(),
			ips: Review.getIps().toHexString(),
			rating: Review.getRating(),
			comments: Review.getComments(),
			userEmail: Review.getUserEmail(),
		};
	}
}
