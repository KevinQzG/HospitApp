import { ObjectId } from "mongodb";
import { EpsDocument, EpsResponse } from "@/models/eps.interface";
import { Eps } from "@/models/eps";

/**
 * Class that allows to map EPS entities from domain to document and vice versa.
 * @class EPSMapper
 */
export class EPSMapper {
    /**
     * Maps an EPS document to an EPS entity.
     * @param {EpsDocument} raw - The EPS document.
     * @returns {Eps} The EPS entity.
     */
    static from_document_to_domain(raw: EpsDocument): Eps {
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
    static from_domain_to_document(eps: Eps): EpsDocument {
        return {
            _id: eps.get_id(),
            name: eps.get_name(),
            "01_8000_phone": eps.get_phone(),
            fax: eps.get_fax(),
            emails: eps.get_emails()            
        };
    }

    /**
     * Maps an EPS response to an EPS entity.
     * @param {EpsResponse} raw - The EPS response.
     * @returns {Eps} The EPS entity.
     */
    static from_response_to_domain(raw: EpsResponse): Eps {
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
    static from_domain_to_response(eps: Eps): EpsResponse {
        return {
            _id: eps.get_id().toHexString(),
            name: eps.get_name(),
            "01_8000_phone": eps.get_phone(),
            fax: eps.get_fax(),
            emails: eps.get_emails()            
        };
    }
}