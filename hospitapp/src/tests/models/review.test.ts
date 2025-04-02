import { ObjectId } from "mongodb";
import { Review } from "@/models/review";
import { ReviewMapper } from "@/utils/mappers/review_mapper";

// Mock the ReviewMapper for testing
jest.mock("@/utils/mappers/review_mapper", () => ({
	ReviewMapper: {
		fromDomainToDocument: jest.fn((review) => ({
			_id: review.getId(),
			user: review.getUser(),
			ips: review.getIps(),
			rating: review.getRating(),
			comments: review.getComments(),
		})),
		fromDomainToResponse: jest.fn((review) => ({
			id: review.getId().toHexString(),
			user: review.getUser().toHexString(),
			ips: review.getIps().toHexString(),
			rating: review.getRating(),
			comments: review.getComments(),
		})),
	},
}));

describe("Review Model", () => {
	const TEST_ID = new ObjectId();
	const TEST_USER = new ObjectId();
	const TEST_IPS = new ObjectId();
	const TEST_RATING = 4;
	const TEST_COMMENTS = "Great service!";

	let review: Review;

	beforeEach(() => {
		review = new Review(
			TEST_ID,
			TEST_USER,
			TEST_IPS,
			TEST_RATING,
			TEST_COMMENTS
		);
	});

	describe("Constructor", () => {
		it("should initialize with provided values", () => {
			expect(review.getId()).toEqual(TEST_ID);
			expect(review.getUser()).toEqual(TEST_USER);
			expect(review.getIps()).toEqual(TEST_IPS);
			expect(review.getRating()).toBe(TEST_RATING);
			expect(review.getComments()).toBe(TEST_COMMENTS);
		});

		it("should generate new ObjectId when not provided", () => {
			const newReview = new Review(
				undefined,
				TEST_USER,
				TEST_IPS,
				TEST_RATING,
				TEST_COMMENTS
			);
			expect(newReview.getId()).toBeInstanceOf(ObjectId);
			expect(newReview.getId()).not.toEqual(TEST_ID); // Ensure it’s unique
		});
	});

	describe("Validation", () => {
		it("should validate with required fields", () => {
			expect(() => review.validate()).not.toThrow();
		});

		it("should throw error when user is missing", () => {
			const invalidReview = new Review(
				TEST_ID,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				undefined as any,
				TEST_IPS,
				TEST_RATING,
				TEST_COMMENTS
			);
			expect(() => invalidReview.validate()).toThrow(
				"Missing required fields"
			);
		});

		it("should throw error when ips is missing", () => {
			const invalidReview = new Review(
				TEST_ID,
				TEST_USER,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				undefined as any,
				TEST_RATING,
				TEST_COMMENTS
			);
			expect(() => invalidReview.validate()).toThrow(
				"Missing required fields"
			);
		});

		it("should throw error when rating is missing", () => {
			const invalidReview = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				undefined as any,
				TEST_COMMENTS
			);
			expect(() => invalidReview.validate()).toThrow(
				"Missing required fields"
			);
		});

		it("should throw error when comments is missing", () => {
			const invalidReview = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				TEST_RATING,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				undefined as any
			);
			expect(() => invalidReview.validate()).toThrow(
				"Missing required fields"
			);
		});

		it("should throw error when rating is less than 0", () => {
			const invalidReview = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				-1,
				TEST_COMMENTS
			);
			expect(() => invalidReview.validate()).toThrow(
				"Invalid rating value"
			);
		});

		it("should throw error when rating is greater than 5", () => {
			const invalidReview = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				6,
				TEST_COMMENTS
			);
			expect(() => invalidReview.validate()).toThrow(
				"Invalid rating value"
			);
		});
	});

	describe("Setters and Getters", () => {
		it("should update and retrieve user", () => {
			const newUser = new ObjectId();
			review.setUser(newUser);
			expect(review.getUser()).toEqual(newUser);
		});

		it("should update and retrieve ips", () => {
			const newIps = new ObjectId();
			review.setIps(newIps);
			expect(review.getIps()).toEqual(newIps);
		});

		it("should update and retrieve rating", () => {
			review.setRating(5);
			expect(review.getRating()).toBe(5);
		});

		it("should update and retrieve comments", () => {
			const newComments = "Updated feedback";
			review.setComments(newComments);
			expect(review.getComments()).toBe(newComments);
		});
	});

	describe("Serialization", () => {
		it("should convert to document correctly", () => {
			const doc = review.toObject();
			expect(ReviewMapper.fromDomainToDocument).toHaveBeenCalledWith(
				review
			);
			expect(doc).toEqual({
				_id: TEST_ID,
				user: TEST_USER,
				ips: TEST_IPS,
				rating: TEST_RATING,
				comments: TEST_COMMENTS,
			});
		});

		it("should convert to response correctly", () => {
			const response = review.toResponse();
			expect(ReviewMapper.fromDomainToResponse).toHaveBeenCalledWith(
				review
			);
			expect(response).toEqual({
				id: TEST_ID.toHexString(),
				user: TEST_USER.toHexString(),
				ips: TEST_IPS.toHexString(),
				rating: TEST_RATING,
				comments: TEST_COMMENTS,
			});
		});

		it("should serialize to JSON string", () => {
			const str = review.toString();
			const parsed = JSON.parse(str);
			expect(parsed).toEqual({
				_id: TEST_ID.toHexString(),
				user: TEST_USER.toHexString(),
				ips: TEST_IPS.toHexString(),
				rating: TEST_RATING,
				comments: TEST_COMMENTS,
			});
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty comments string", () => {
			const reviewWithEmptyComments = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				TEST_RATING,
				""
			);
			expect(reviewWithEmptyComments.getComments()).toBe("");
			expect(() => reviewWithEmptyComments.validate()).not.toThrow();
		});

		it("should handle rating of 0 gracefully", () => {
			const reviewWithZeroRating = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				0,
				TEST_COMMENTS
			);
			expect(reviewWithZeroRating.getRating()).toBe(0);
			expect(() => reviewWithZeroRating.validate()).toThrow(
				"Missing required fields"
			);
		});

		it("should handle rating of 5 as valid", () => {
			const reviewWithMaxRating = new Review(
				TEST_ID,
				TEST_USER,
				TEST_IPS,
				5,
				TEST_COMMENTS
			);
			expect(reviewWithMaxRating.getRating()).toBe(5);
			expect(() => reviewWithMaxRating.validate()).not.toThrow();
		});
	});
});
