import { ObjectId } from "mongodb";
import { IpsDocument } from "@/models/ips.interface";
import { Ips } from "@/models/ips";
import { IpsMapper } from "@/utils/mappers/ips_mapper";

describe("IpsMapper", () => {
	const SAMPLE_DOC: IpsDocument = {
		_id: new ObjectId(),
		name: "Test IPS",
		department: "Test Department",
		town: "Test Town",
		address: "Test Address",
		phone: "123456789",
		email: "test@example.com",
		location: {
			type: "Point",
			coordinates: [-75.6, 6.1],
		},
		level: 2,
		distance: 1500,
	};

	const PARTIAL_DOC: IpsDocument = {
		_id: new ObjectId(),
		name: "Partial IPS",
		department: "Partial Department",
		town: "Partial Town",
		address: "Partial Address",
		location: {
			type: "Point",
			coordinates: [-75.7, 6.2],
		},
	};
	let ips, doc;

	it("should correctly map document to domain with full data", () => {
		ips = IpsMapper.fromDocumentToDomain(SAMPLE_DOC);

		expect(ips.getId()).toEqual(SAMPLE_DOC._id);
		expect(ips.getName()).toBe(SAMPLE_DOC.name);
		expect(ips.getPhone()).toBe(SAMPLE_DOC.phone);
		expect(ips.getLocation().coordinates).toEqual(
			SAMPLE_DOC.location.coordinates
		);
		expect(ips.getDistance()).toBe(SAMPLE_DOC.distance);
	});

	it("should handle missing optional fields in document", () => {
		ips = IpsMapper.fromDocumentToDomain(PARTIAL_DOC);

		expect(ips.getPhone()).toBeUndefined();
		expect(ips.getEmail()).toBeUndefined();
		expect(ips.getLevel()).toBeUndefined();
		expect(ips.getDistance()).toBeUndefined();
		expect(ips.getEps()).toBeUndefined();
		expect(ips.getSpecialties()).toBeUndefined();
	});

	it("should correctly map domain to document", () => {
		ips = new Ips(
			SAMPLE_DOC._id,
			SAMPLE_DOC.name,
			SAMPLE_DOC.department,
			SAMPLE_DOC.town,
			SAMPLE_DOC.address,
			SAMPLE_DOC.location,
			SAMPLE_DOC.phone,
			SAMPLE_DOC.email,
			SAMPLE_DOC.level,
			SAMPLE_DOC.distance
		);

		doc = IpsMapper.fromDomainToDocument(ips);

		expect(doc).toMatchObject(SAMPLE_DOC);
		expect(doc.phone).toBe(SAMPLE_DOC.phone);
		expect(doc.level).toBe(SAMPLE_DOC.level);
	});

	it("should exclude undefined values in domain to document mapping", () => {
		ips = new Ips(
			PARTIAL_DOC._id,
			PARTIAL_DOC.name,
			PARTIAL_DOC.department,
			PARTIAL_DOC.town,
			PARTIAL_DOC.address,
			PARTIAL_DOC.location
		);

		doc = IpsMapper.fromDomainToDocument(ips);

		expect(doc.phone).toBeUndefined();
		expect(doc.email).toBeUndefined();
		expect(doc.level).toBeUndefined();
		expect(doc.distance).toBeUndefined();
		expect(doc.eps).toBeUndefined();
		expect(doc.specialties).toBeUndefined();
	});
});
