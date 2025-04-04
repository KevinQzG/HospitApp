import { ObjectId } from "mongodb";
import { ReviewDocument, ReviewResponse } from "@/models/review.interface";
import { Review } from "@/models/review";
import { ReviewMapper } from "@/utils/mappers/review_mapper";

describe("ReviewMapper", () => {
	const FULL_DOC: ReviewDocument = {
		_id: new ObjectId(),
		user: new ObjectId(),
		ips: new ObjectId(),
		rating: 4,
		comments: "Great service!",
	};

	const FULL_RESP: ReviewResponse = {
		_id: FULL_DOC._id.toHexString(),
		user: FULL_DOC.user.toHexString(),
		ips: FULL_DOC.ips.toHexString(),
		rating: FULL_DOC.rating,
		comments: FULL_DOC.comments,
	};

	let review: Review;
	let doc: ReviewDocument;
	let res: ReviewResponse;

	describe("Document-Domain", () => {
		it("should map complete document to domain", () => {
			review = ReviewMapper.fromDocumentToDomain(FULL_DOC);

			expect(review.getId()).toEqual(FULL_DOC._id);
			expect(review.getUser()).toEqual(FULL_DOC.user);
			expect(review.getIps()).toEqual(FULL_DOC.ips);
			expect(review.getRating()).toEqual(FULL_DOC.rating);
			expect(review.getComments()).toEqual(FULL_DOC.comments);
		});

		it("should map complete domain to document", () => {
			review = new Review(
				FULL_DOC._id,
				FULL_DOC.user,
				FULL_DOC.ips,
				FULL_DOC.rating,
				FULL_DOC.comments
			);

			doc = ReviewMapper.fromDomainToDocument(review);

			expect(doc).toEqual(FULL_DOC);
		});

		it("should maintain data integrity in bidirectional", () => {
			const ORIGINAL_DOC = FULL_DOC;
			const DOMAIN = ReviewMapper.fromDocumentToDomain(ORIGINAL_DOC);
			const NEW_DOC = ReviewMapper.fromDomainToDocument(DOMAIN);

			expect(NEW_DOC).toEqual(ORIGINAL_DOC);
		});
	});

	describe("Response-Domain", () => {
		it("should map complete response to domain", () => {
			review = ReviewMapper.fromResponseToDomain(FULL_RESP);

			expect(review.getId().toHexString()).toEqual(FULL_RESP._id);
			expect(review.getUser().toHexString()).toEqual(FULL_RESP.user);
			expect(review.getIps().toHexString()).toEqual(FULL_RESP.ips);
			expect(review.getRating()).toEqual(FULL_RESP.rating);
			expect(review.getComments()).toEqual(FULL_RESP.comments);
		});

		it("should map complete domain to response", () => {
			review = new Review(
				FULL_DOC._id,
				FULL_DOC.user,
				FULL_DOC.ips,
				FULL_DOC.rating,
				FULL_DOC.comments
			);

			res = ReviewMapper.fromDomainToResponse(review);

			expect(res).toEqual(FULL_RESP);
		});

		it("should maintain data integrity in bidirectional", () => {
			const ORIGINAL_RESP = FULL_RESP;
			const DOMAIN = ReviewMapper.fromResponseToDomain(ORIGINAL_RESP);
			const NEW_RESP = ReviewMapper.fromDomainToResponse(DOMAIN);

			expect(NEW_RESP).toEqual(ORIGINAL_RESP);
		});
	});
});
