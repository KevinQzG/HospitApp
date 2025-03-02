import { EPSDocument } from "@/models/eps.interface";
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
    static to_domain(raw: EPSDocument): EPS {
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
    static to_document(eps: EPS): EPSDocument {
        return {
            _id: eps.getId(),
            name: eps.getName(),
            "01_8000_phone": eps.getPhone(),
            fax: eps.getFax(),
            emails: eps.getEmails()            
        };
    }
}