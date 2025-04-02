import { ObjectId } from "mongodb";
import { EpsDocument, EpsResponse } from "@/models/eps.interface";
import { Eps } from "@/models/eps";

/**
 * Class that allows to map EPS entities from domain to document and vice versa.
 * @class EPSMapper
 */
export class EpsMapper {
	/**
	 * Maps an EPS document to an EPS entity.
	 * @param {EpsDocument} raw - The EPS document.
	 * @returns {Eps} The EPS entity.
	 */
	static fromDocumentToDomain(raw: EpsDocument): Eps {
		return new Eps(
			raw._id,
			raw.name,
			raw["01_8000_phone"],
			raw.fax,
			raw.emails
		);
	}

	/**
	 * Maps an EPS entity to an EPS document.
	 * @param {Eps} eps - The EPS entity.
	 * @returns {EpsDocument} The EPS document.
	 */
	static fromDomainToDocument(eps: Eps): EpsDocument {
		return {
			_id: eps.getId(),
			name: eps.getName(),
			"01_8000_phone": eps.getPhone(),
			fax: eps.getFax(),
			emails: eps.getEmails(),
		};
	}

	/**
	 * Maps an EPS response to an EPS entity.
	 * @param {EpsResponse} raw - The EPS response.
	 * @returns {Eps} The EPS entity.
	 */
	static fromResponseToDomain(raw: EpsResponse): Eps {
		return new Eps(
			new ObjectId(raw._id),
			raw.name,
			raw["01_8000_phone"],
			raw.fax,
			raw.emails
		);
	}

	/**
	 * Maps an EPS entity to an EPS response.
	 * @param {Eps} eps - The EPS entity.
	 * @returns {EpsResponse} The EPS response.
	 */
	static fromDomainToResponse(eps: Eps): EpsResponse {
		return {
			_id: eps.getId().toHexString(),
			name: eps.getName(),
			"01_8000_phone": eps.getPhone(),
			fax: eps.getFax(),
			emails: eps.getEmails(),
		};
	}
}
