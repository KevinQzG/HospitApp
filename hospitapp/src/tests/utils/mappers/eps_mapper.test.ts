import { ObjectId } from "mongodb";
import { EpsDocument } from "@/models/eps.interface";
import { Eps } from "@/models/eps";
import { EpsMapper } from "@/utils/mappers/eps_mapper";

describe("EpsMapper", () => {
	const SAMPLE_DOC: EpsDocument = {
		_id: new ObjectId("67b7885ec6dcb343450c057f"),
		name: "Test EPS",
		"01_8000_phone": "1234567",
		fax: "7654321",
		emails: "example@example.com  , example@example.com",
	};

	const AUTO_GENERATED_DOC: EpsDocument = {
		_id: new ObjectId(),
		name: "Auto-generated EPS",
		"01_8000_phone": "1234567",
		fax: "7654321",
		emails: "eexample@example.com",
	};

	let eps: Eps;
	let doc: EpsDocument;

	it("should correctly map document to domain with full data", () => {
		eps = EpsMapper.fromDocumentToDomain(SAMPLE_DOC);

		expect(eps.getId()).toEqual(SAMPLE_DOC._id);
		expect(eps.getName()).toBe(SAMPLE_DOC.name);
		expect(eps.getPhone()).toBe(SAMPLE_DOC["01_8000_phone"]);
		expect(eps.getFax()).toBe(SAMPLE_DOC.fax);
		expect(eps.getEmails()).toBe(SAMPLE_DOC.emails);
	});

	it("should handle auto-generated ID in document to domain mapping", () => {
		eps = EpsMapper.fromDocumentToDomain(AUTO_GENERATED_DOC);

		expect(eps.getId()).toBeInstanceOf(ObjectId);
		expect(eps.getName()).toBe(AUTO_GENERATED_DOC.name);
	});

	it("should correctly map domain to document with provided ID", () => {
		eps = new Eps(
			SAMPLE_DOC._id,
			SAMPLE_DOC.name,
			SAMPLE_DOC["01_8000_phone"],
			SAMPLE_DOC.fax,
			SAMPLE_DOC.emails
		);
		doc = EpsMapper.fromDomainToDocument(eps);

		expect(doc).toEqual(SAMPLE_DOC);
		expect(doc._id.equals(SAMPLE_DOC._id)).toBe(true);
	});

	it("should handle auto-generated ID in domain to document mapping", () => {
		eps = new Eps(
			undefined,
			"New EPS",
			"1234567",
			"7654321",
			"eexample@example.com"
		);
		doc = EpsMapper.fromDomainToDocument(eps);

		expect(doc._id).toBeInstanceOf(ObjectId);
		expect(doc.name).toBe("New EPS");
		expect(doc["01_8000_phone"]).toBe("1234567");
		expect(doc.fax).toBe("7654321");
		expect(doc.emails).toBe("eexample@example.com");
	});

	it("should maintain data integrity in both directions", () => {
		// Document -> Domain
		const DOMAIN_EPS = EpsMapper.fromDocumentToDomain(SAMPLE_DOC);

		// Domain -> Document
		const NEW_DOC = EpsMapper.fromDomainToDocument(DOMAIN_EPS);

		expect(NEW_DOC).toEqual(SAMPLE_DOC);
	});
});
