import { ObjectId } from "mongodb";
import { Specialty } from "@/models/specialty";

describe("Specialty Model", () => {
	const TEST_ID = new ObjectId();
	const TEST_NAME = "Pediatrics";
	const TEST_SCHEDULE = "09:00-17:00";

	let specialty: Specialty;

	beforeEach(() => {
		specialty = new Specialty(TEST_ID, TEST_NAME, TEST_SCHEDULE);
	});

	describe("Constructor", () => {
		it("should initialize with provided values", () => {
			expect(specialty.getId()).toEqual(TEST_ID);
			expect(specialty.getName()).toBe(TEST_NAME);
			expect(specialty.getScheduleMonday()).toBe(TEST_SCHEDULE);
		});

		it("should generate new ObjectId when not provided", () => {
			const NEW_SPECIALTY = new Specialty(undefined, "New Specialty");
			expect(NEW_SPECIALTY.getId()).toBeInstanceOf(ObjectId);
		});
	});

	describe("Validation", () => {
		it("should validate with required fields", () => {
			expect(() => specialty.validate()).not.toThrow();
		});

		it("should throw error when name is missing", () => {
			const INVALID_SPECIALTY = new Specialty(
				undefined,
				"",
				TEST_SCHEDULE
			);
			expect(() => INVALID_SPECIALTY.validate()).toThrow(
				"Missing required fields"
			);
		});
	});

	describe("Setters and Getters", () => {
		it("should update and retrieve all schedule days", () => {
			specialty.setScheduleTuesday("10:00-18:00");
			specialty.setScheduleWednesday("08:00-16:00");

			expect(specialty.getScheduleTuesday()).toBe("10:00-18:00");
			expect(specialty.getScheduleWednesday()).toBe("08:00-16:00");
		});

		it("should validate when updating name", () => {
			expect(() => specialty.setName("Updated Name")).not.toThrow();

			expect(() => specialty.setName("")).toThrow(
				"Missing required fields"
			);
		});
	});

	describe("Serialization", () => {
		it("should convert to document correctly", () => {
			const DOC = specialty.toObject();

			expect(DOC).toEqual({
				_id: TEST_ID,
				name: TEST_NAME,
				"schedule_monday": TEST_SCHEDULE,
				"schedule_tuesday": undefined,
				"schedule_wednesday": undefined,
				"schedule_thursday": undefined,
				"schedule_friday": undefined,
				"schedule_saturday": undefined,
				"schedule_sunday": undefined,
			});
		});

		it("should serialize to JSON string", () => {
			const STR = specialty.toString();
			const PARSED = JSON.parse(STR);

			expect(PARSED).toEqual({
				_id: TEST_ID.toHexString(),
				name: TEST_NAME,
				"schedule_monday": TEST_SCHEDULE,
			});
		});
	});

	describe("Partial Schedule Handling", () => {
		it("should handle undefined schedule days", () => {
			const MINIMAL_SPECIALTY = new Specialty(
				undefined,
				"Minimal Specialty"
			);

			expect(MINIMAL_SPECIALTY.getScheduleThursday()).toBeUndefined();
			expect(
				MINIMAL_SPECIALTY.toObject().schedule_friday
			).toBeUndefined();
		});
	});
});
