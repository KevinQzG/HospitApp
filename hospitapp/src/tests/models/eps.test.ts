import { ObjectId } from "mongodb";
import { Eps } from "@/models/eps";
import { EpsDocument, EpsResponse } from "@/models/eps.interface";

describe("EPS Class", () => {
	const TEST_EPS_NAME = "Test EPS";
	const TEST_EPS_ID = new ObjectId();
	const TEST_EPS_PHONE = "1234567";
	const TEST_EPS_FAX = "7654321";
	const TEST_EPS_EMAILS = "example@gmail";
	let eps: Eps;

	beforeEach(() => {
		eps = new Eps(
			TEST_EPS_ID,
			TEST_EPS_NAME,
			TEST_EPS_PHONE,
			TEST_EPS_FAX,
			TEST_EPS_EMAILS
		);
	});

	describe("Constructor", () => {
		it("should create instance with provided values", () => {
			expect(eps.getId()).toEqual(TEST_EPS_ID);
			expect(eps.getName()).toBe(TEST_EPS_NAME);
		});

		it("should generate new ObjectId when not provided", () => {
			const NEW_EPS = new Eps(
				undefined,
				TEST_EPS_NAME,
				TEST_EPS_PHONE,
				TEST_EPS_FAX,
				TEST_EPS_EMAILS
			);
			expect(NEW_EPS.getId()).toBeInstanceOf(ObjectId);
		});
	});

	describe("Validation", () => {
		it("should validate successfully with valid data", () => {
			expect(() => eps.validate()).not.toThrow();
		});

		it("should throw error when name is missing", () => {
			const INVALID_EPS = new Eps(
				undefined,
				"",
				TEST_EPS_PHONE,
				TEST_EPS_FAX,
				TEST_EPS_EMAILS
			);
			expect(() => INVALID_EPS.validate()).toThrow(
				"Missing required fields"
			);
		});
	});

	describe("toObject()", () => {
		let doc: EpsDocument;

		it("should return proper EPSDocument structure", () => {
			doc = eps.toObject();

			expect(doc).toEqual({
				_id: TEST_EPS_ID,
				name: TEST_EPS_NAME,
				"01_8000_phone": TEST_EPS_PHONE,
				fax: TEST_EPS_FAX,
				emails: TEST_EPS_EMAILS,
			});
		});

		it("should maintain data integrity", () => {
			doc = eps.toObject();
			expect(doc._id.equals(TEST_EPS_ID)).toBe(true);
			expect(doc.name).toBe(TEST_EPS_NAME);
		});
	});

	describe("Getters", () => {
		it("should return correct ID", () => {
			expect(eps.getId().equals(TEST_EPS_ID)).toBe(true);
		});

		it("should return correct name", () => {
			expect(eps.getName()).toBe(TEST_EPS_NAME);
		});
	});

	describe("Setters", () => {
		const NEW_NAME = "Updated EPS Name";

		it("should update name correctly", () => {
			eps.setName(NEW_NAME);
			expect(eps.getName()).toBe(NEW_NAME);
		});

		it("should validate after name update", () => {
			eps.setName(NEW_NAME);
			expect(() => eps.validate()).not.toThrow();
		});

		it("should throw error when setting invalid name", () => {
			expect(() => eps.setName("")).toThrow("Missing required fields");
		});
	});

	describe("toString()", () => {
		let str;
		it("should return valid JSON string", () => {
			str = eps.toString();
			const PARSED = JSON.parse(str);

			expect(PARSED).toEqual({
				_id: TEST_EPS_ID.toHexString(),
				name: TEST_EPS_NAME,
				"01_8000_phone": TEST_EPS_PHONE,
				fax: TEST_EPS_FAX,
				emails: TEST_EPS_EMAILS,
			});
		});

		it("should maintain data consistency", () => {
			str = eps.toString();
			expect(str).toBe(JSON.stringify(eps.toObject()));
		});
	});

	describe("to_response()", () => {
		let doc: EpsResponse;

		it("should return proper EPSDocument structure", () => {
			doc = eps.toResponse();

			expect(doc).toEqual({
				_id: TEST_EPS_ID.toHexString(),
				name: TEST_EPS_NAME,
				"01_8000_phone": TEST_EPS_PHONE,
				fax: TEST_EPS_FAX,
				emails: TEST_EPS_EMAILS,
			});
		});

		it("should maintain data integrity", () => {
			doc = eps.toResponse();
			expect(doc._id).toBe(TEST_EPS_ID.toHexString());
			expect(doc.name).toBe(TEST_EPS_NAME);
		});
	});
});
