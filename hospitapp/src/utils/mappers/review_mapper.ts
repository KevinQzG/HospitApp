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
			raw.createdAt,
			raw.lastUpdated,
			raw.userEmail,
			raw.ipsName
		);
	}

	/**
	 * Maps an Review entity to an Review document.
	 * @param {Review} review - The Review entity.
	 * @returns {ReviewDocument} The Review document.
	 */
	static fromDomainToDocument(review: Review): ReviewDocument {
		return {
			_id: review.getId(),
			user: review.getUser(),
			ips: review.getIps(),
			rating: review.getRating(),
			comments: review.getComments(),
			createdAt: review.getCreatedAt(),
			lastUpdated: review.getLastUpdated(),
			userEmail: review.getUserEmail(),
			ipsName: review.getIpsName(),
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
			new Date(raw.createdAt),
			new Date(raw.lastUpdated),
			raw.userEmail,
			raw.ipsName
		);
	}

	/**
	 * Maps an Review entity to an Review response.
	 * @param {Review} review - The Review entity.
	 * @returns {ReviewResponse} The Review response.
	 */
	static fromDomainToResponse(review: Review): ReviewResponse {
		return {
			_id: review.getId().toHexString(),
			user: review.getUser().toHexString(),
			ips: review.getIps().toHexString(),
			rating: review.getRating(),
			comments: review.getComments(),
			createdAt: review.getCreatedAt().toISOString(),
			lastUpdated: review.getLastUpdated().toISOString(),
			userEmail: review.getUserEmail(),
			ipsName: review.getIpsName(),
		};
	}
}
