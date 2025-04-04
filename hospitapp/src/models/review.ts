import { ObjectId } from "mongodb";
import { ReviewResponse, ReviewDocument } from "./review.interface";
import { ReviewMapper } from "@/utils/mappers/review_mapper";

/**
 * Class that defines the structure and behavior of the Review entity.
 * @class Review
 */
export class Review {
	private _id: ObjectId;
	private user: ObjectId;
	private ips: ObjectId;
	private rating: number;
	private comments: string;
	private userEmail?: string;
	private ipsName?: string;

	/**
	 * Creates an instance of Review.
	 * @param {ObjectId} _id - Unique identifier of the Review.
	 * @param {ObjectId} user - Unique identifier of the user.
	 * @param {ObjectId} ips - Unique identifier of the IPS.
	 * @param {number} rating - Rating given by the user.
	 * @param {string} comments - Comments provided by the user.
	 * @param {string} userEmail - Email of the user. (optional)
	 * @param {string} ipsName - Name of the IPS. (optional)
	 */
	constructor(
		_id: ObjectId = new ObjectId(),
		user: ObjectId,
		ips: ObjectId,
		rating: number,
		comments: string,
		userEmail?: string,
		ipsName?: string
	) {
		this._id = _id;
		this.user = user;
		this.ips = ips;
		this.rating = rating;
		this.comments = comments;
		this.userEmail = userEmail;
		this.ipsName = ipsName;
	}

	/**
	 * Validates the Review entity.
	 * @throws {Error} If any required field is missing or invalid.
	 */
	validate(): void {
		if (
			!this.user ||
			!this.ips ||
			!this.rating ||
			!(typeof this.comments === "string") ||
			this.comments.length < 0
		) {
			throw new Error("Missing required fields");
		}

		if (this.rating < 0 || this.rating > 5) {
			throw new Error("Invalid rating value");
		}
	}

	/**
	 * Converts the Review entity to a plain object as a document.
	 * @returns {ReviewDocument} A plain object representation of the Review.
	 */
	toObject(): ReviewDocument {
		return ReviewMapper.fromDomainToDocument(this);
	}

	/**
	 * Converts the Review entity to a plain object as a response.
	 * @returns {ReviewResponse} A plain object representation of the Review.
	 */
	toResponse(): ReviewResponse {
		return ReviewMapper.fromDomainToResponse(this);
	}

	/**
	 * Gets the unique identifier of the Review.
	 * @returns {ObjectId} The unique identifier of the Review.
	 */
	getId(): ObjectId {
		return this._id;
	}

	/**
	 * Gets the unique identifier of the user.
	 * @returns {ObjectId} The unique identifier of the user.
	 */
	getUser(): ObjectId {
		return this.user;
	}

	/**
	 * Gets the unique identifier of the IPS.
	 * @returns {ObjectId} The unique identifier of the IPS.
	 */
	getIps(): ObjectId {
		return this.ips;
	}

	/**
	 * Gets the rating given by the user.
	 * @returns {number} The rating given by the user.
	 */
	getRating(): number {
		return this.rating;
	}

	/**
	 * Gets the comments provided by the user.
	 * @returns {string} The comments provided by the user.
	 */
	getComments(): string {
		return this.comments;
	}

	/**
	 * Gets the email of the user.
	 * @returns {string} The email of the user.
	 */
	getUserEmail(): string | undefined {
		return this.userEmail;
	}

	/**
	 * Gets the name of the IPS.
	 * @returns {string} The name of the IPS.
	 */
	getIpsName(): string | undefined {
		return this.ipsName;
	}

	/**
	 * Sets the unique identifier of the user.
	 * @param {ObjectId} user - The unique identifier of the user.
	 */
	setUser(user: ObjectId): void {
		this.user = user;
		this.validate();
	}

	/**
	 * Sets the unique identifier of the IPS.
	 * @param {ObjectId} ips - The unique identifier of the IPS.
	 */
	setIps(ips: ObjectId): void {
		this.ips = ips;
		this.validate();
	}

	/**
	 * Sets the rating given by the user.
	 * @param {number} rating - The rating given by the user.
	 */
	setRating(rating: number): void {
		this.rating = rating;
		this.validate();
	}

	/**
	 * Sets the comments provided by the user.
	 * @param {string} comments - The comments provided by the user.
	 */
	setComments(comments: string): void {
		this.comments = comments;
		this.validate();
	}

	/**
	 * Sets the email of the user.
	 * @param {string} userEmail - The email of the user.
	 */
	setUserEmail(userEmail?: string): void {
		this.userEmail = userEmail ? userEmail : undefined;
	}

	/**
	 * Sets the name of the IPS.
	 * @param {string} ipsName - The name of the IPS.
	 */
	setIpsName(ipsName?: string): void {
		this.ipsName = ipsName ? ipsName : undefined;
	}

	/**
	 * Converts the Review entity to a string.
	 * @returns {string} A string representation of the Review.
	 */
	toString(): string {
		return JSON.stringify(this.toObject());
	}
}
