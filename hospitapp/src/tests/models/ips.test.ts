import { Ips } from "@/models/ips";
import { Eps } from "@/models/eps";
import { Specialty } from "@/models/specialty";
import { ObjectId } from "mongodb";
import { IpsResponse } from "@/models/ips.interface";

describe("IPS Class", () => {
	const VALID_IPS_DATA = {
		_id: new ObjectId(),
		name: "Hospital Example",
		department: "ANTIOQUIA",
		town: "LA ESTRELLA",
		address: "Test address",
		phone: "5446546",
		email: "hospital@example.com",
		location: {
			type: "Point",
			coordinates: [-75.546, 6.66] as [number, number],
		},
		level: 1,
	};

	it("should create an IPS instance with valid data", () => {
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level
		);

		expect(IPS).toBeInstanceOf(Ips);
		expect(IPS.getId()).toEqual(VALID_IPS_DATA._id);
		expect(IPS.getName()).toEqual(VALID_IPS_DATA.name);
		expect(IPS.getDepartment()).toEqual(VALID_IPS_DATA.department);
		expect(IPS.getTown()).toEqual(VALID_IPS_DATA.town);
		expect(IPS.getAddress()).toEqual(VALID_IPS_DATA.address);
		expect(IPS.getPhone()).toEqual(VALID_IPS_DATA.phone);
		expect(IPS.getEmail()).toEqual(VALID_IPS_DATA.email);
		expect(IPS.getLocation()).toEqual(VALID_IPS_DATA.location);
		expect(IPS.getLevel()).toEqual(VALID_IPS_DATA.level);
	});

	it("should validate an IPS instance with valid data", () => {
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level
		);

		expect(() => IPS.validate()).not.toThrow();
	});

	it("should throw an error when validating an IPS instance with missing required fields", () => {
		const INVALID_IPS_DATA = { ...VALID_IPS_DATA, name: "" }; // Missing name
		const IPS = new Ips(
			INVALID_IPS_DATA._id,
			INVALID_IPS_DATA.name,
			INVALID_IPS_DATA.department,
			INVALID_IPS_DATA.town,
			INVALID_IPS_DATA.address,
			INVALID_IPS_DATA.location,
			INVALID_IPS_DATA.phone,
			INVALID_IPS_DATA.email,
			INVALID_IPS_DATA.level
		);

		expect(() => IPS.validate()).toThrow("Missing required fields");
	});

	it("should throw an error when validating an IPS instance with invalid location coordinates", () => {
		const INVALID_IPS_DATA = {
			...VALID_IPS_DATA,
			location: {
				type: "Point",
				coordinates: [] as unknown as [number, number],
			},
		};

		// Create the IPS instance
		const IPS = new Ips(
			INVALID_IPS_DATA._id,
			INVALID_IPS_DATA.name,
			INVALID_IPS_DATA.department,
			INVALID_IPS_DATA.town,
			INVALID_IPS_DATA.address,
			INVALID_IPS_DATA.location,
			INVALID_IPS_DATA.phone,
			INVALID_IPS_DATA.email,
			INVALID_IPS_DATA.level
		);

		// Validate the IPS instance and expect an error
		expect(() => IPS.validate()).toThrow("Invalid location coordinates");
	});

	it("should throw an error when validating an IPS instance with invalid location type", () => {
		const INVALID_IPS_DATA = {
			...VALID_IPS_DATA,
			location: {
				type: "Test",
				coordinates: [-75.546, 6.66] as [number, number],
			}, // Invalid type
		};
		const IPS = new Ips(
			INVALID_IPS_DATA._id,
			INVALID_IPS_DATA.name,
			INVALID_IPS_DATA.department,
			INVALID_IPS_DATA.town,
			INVALID_IPS_DATA.address,
			INVALID_IPS_DATA.location,
			INVALID_IPS_DATA.phone,
			INVALID_IPS_DATA.email,
			INVALID_IPS_DATA.level
		);

		expect(() => IPS.validate()).toThrow("Invalid location type");
	});

	it("should convert an IPS instance to a plain object", () => {
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level
		);

		const IPS_OBJECT = IPS.toObject();

		expect(IPS_OBJECT).toEqual({
			_id: VALID_IPS_DATA._id,
			name: VALID_IPS_DATA.name,
			department: VALID_IPS_DATA.department,
			town: VALID_IPS_DATA.town,
			address: VALID_IPS_DATA.address,
			phone: VALID_IPS_DATA.phone,
			email: VALID_IPS_DATA.email,
			location: VALID_IPS_DATA.location,
			level: VALID_IPS_DATA.level,
			distance: undefined, // Optional field
			// eps: undefined // Optional field
		});
	});

	it("should include the distance field in the plain object if provided", () => {
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level,
			1234.56 // Distance
		);

		const IPS_OBJECT = IPS.toObject();

		expect(IPS_OBJECT).toEqual({
			_id: VALID_IPS_DATA._id,
			name: VALID_IPS_DATA.name,
			department: VALID_IPS_DATA.department,
			town: VALID_IPS_DATA.town,
			address: VALID_IPS_DATA.address,
			phone: VALID_IPS_DATA.phone,
			email: VALID_IPS_DATA.email,
			location: VALID_IPS_DATA.location,
			level: VALID_IPS_DATA.level,
			distance: 1234.56, // Included distance
		});
	});

	it("should include the EPS field in the plain object if provided", () => {
		const EPS = new Eps(
			new ObjectId(),
			"EPS Example",
			"546546",
			"546546546",
			"email@example.com"
		);
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level,
			undefined, // Distance
			[EPS] // EPS
		);

		const IPS_OBJECT = IPS.toObject();

		expect(IPS_OBJECT).toEqual({
			_id: VALID_IPS_DATA._id,
			name: VALID_IPS_DATA.name,
			department: VALID_IPS_DATA.department,
			town: VALID_IPS_DATA.town,
			address: VALID_IPS_DATA.address,
			phone: VALID_IPS_DATA.phone,
			email: VALID_IPS_DATA.email,
			location: VALID_IPS_DATA.location,
			level: VALID_IPS_DATA.level,
			distance: undefined, // Optional field
			eps: [EPS.toObject()], // Included EPS
		});
	});

	it("should include the specialties field in the plain object if provided", () => {
		const SPECIALTY = new Specialty(new ObjectId(), "Specialty Example");
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level,
			undefined, // Distance
			undefined, // EPS
			[SPECIALTY] // Specialty
		);

		const IPS_OBJECT = IPS.toObject();

		expect(IPS_OBJECT).toEqual({
			_id: VALID_IPS_DATA._id,
			name: VALID_IPS_DATA.name,
			department: VALID_IPS_DATA.department,
			town: VALID_IPS_DATA.town,
			address: VALID_IPS_DATA.address,
			phone: VALID_IPS_DATA.phone,
			email: VALID_IPS_DATA.email,
			location: VALID_IPS_DATA.location,
			level: VALID_IPS_DATA.level,
			specialties: [SPECIALTY.toObject()], // Included Specialty
		});
	});

	describe("to_response()", () => {
		let doc: IpsResponse;
		const IPS = new Ips(
			VALID_IPS_DATA._id,
			VALID_IPS_DATA.name,
			VALID_IPS_DATA.department,
			VALID_IPS_DATA.town,
			VALID_IPS_DATA.address,
			VALID_IPS_DATA.location,
			VALID_IPS_DATA.phone,
			VALID_IPS_DATA.email,
			VALID_IPS_DATA.level
		);

		it("should return proper EPSDocument structure", () => {
			doc = IPS.toResponse();

			expect(doc).toEqual({
				_id: VALID_IPS_DATA._id.toHexString(),
				name: VALID_IPS_DATA.name,
				department: VALID_IPS_DATA.department,
				town: VALID_IPS_DATA.town,
				address: VALID_IPS_DATA.address,
				phone: VALID_IPS_DATA.phone,
				email: VALID_IPS_DATA.email,
				location: VALID_IPS_DATA.location,
				level: VALID_IPS_DATA.level,
				distance: undefined, // Optional field
				// eps: undefined // Optional field
			});
		});

		it("should maintain data integrity", () => {
			doc = IPS.toResponse();
			expect(doc._id).toBe(VALID_IPS_DATA._id.toHexString());
			expect(doc.name).toBe(VALID_IPS_DATA.name);
		});
	});
});
