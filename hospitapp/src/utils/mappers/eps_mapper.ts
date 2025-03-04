import { ObjectId } from "mongodb";
import { EPSDocument, EPSResponse } from "@/models/eps.interface";
import { EPS } from "@/models/eps";

/**
 * Class that allows to map EPS entities from domain to document and vice versa.
 * @class EPSMapper
 */
export class EPSMapper {
    /**
     * Maps an EPS document to an EPS entity.
     * @param {EPSDocument} raw - The EPS document.
     * @returns {EPS} The EPS entity.
     */
    static from_document_to_domain(raw: EPSDocument): EPS {
        return new EPS(
            raw._id,
            raw.name,
            raw["01_8000_phone"],
            raw.fax,
            raw.emails
        );
    }

    /**
     * Maps an EPS entity to an EPS document.
     * @param {EPS} eps - The EPS entity.
     * @returns {EPSDocument} The EPS document.
     */
    static from_domain_to_document(eps: EPS): EPSDocument {
        return {
            _id: eps.getId(),
            name: eps.getName(),
            "01_8000_phone": eps.getPhone(),
            fax: eps.getFax(),
            emails: eps.getEmails()            
        };
    }

    /**
     * Maps an EPS response to an EPS entity.
     * @param {EPSResponse} raw - The EPS response.
     * @returns {EPS} The EPS entity.
     */
    static from_response_to_domain(raw: EPSResponse): EPS {
        return new EPS(
            new ObjectId(raw._id),
            raw.name,
            raw["01_8000_phone"],
            raw.fax,
            raw.emails
        );
    } 

    /**
     * Maps an EPS entity to an EPS response.
     * @param {EPS} eps - The EPS entity.
     * @returns {EPSResponse} The EPS response.
     */
    static from_domain_to_response(eps: EPS): EPSResponse {
        return {
            _id: eps.getId().toHexString(),
            name: eps.getName(),
            "01_8000_phone": eps.getPhone(),
            fax: eps.getFax(),
            emails: eps.getEmails()            
        };
    }
}