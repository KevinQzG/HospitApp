import { ObjectId } from "mongodb";
import { SpecialtyDocument, SpecialtyResponse } from "@/models/specialty.interface";
import { Specialty } from "@/models/specialty";

/**
 * Class that allows to map Specialty entities from domain to document and vice versa.
 * @class SpecialtyMapper
 */
export class SpecialtyMapper {
    /**
     * Maps an Specialty document to an Specialty entity.
     * @param {SpecialtyDocument} raw - The Specialty document.
     * @returns {Specialty} The Specialty entity.
     */
    static from_document_to_domain(raw: SpecialtyDocument): Specialty {
        return new Specialty(
            raw._id,
            raw.name,
            raw.schedule_monday,
            raw.schedule_tuesday,
            raw.schedule_wednesday,
            raw.schedule_thursday,
            raw.schedule_friday,
            raw.schedule_saturday,
            raw.schedule_sunday
        );
    }

    /**
     * Maps an Specialty entity to an Specialty document.
     * @param {Specialty} specialty - The Specialty entity.
     * @returns {SpecialtyDocument} The Specialty document.
     */
    static from_domain_to_document(specialty: Specialty): SpecialtyDocument {
        return {
            _id: specialty.get_id(),
            name: specialty.get_name(),
            schedule_monday: specialty.get_schedule_monday(),
            schedule_tuesday: specialty.get_schedule_tuesday(),
            schedule_wednesday: specialty.get_schedule_wednesday(),
            schedule_thursday: specialty.get_schedule_thursday(),
            schedule_friday: specialty.get_schedule_friday(),
            schedule_saturday: specialty.get_schedule_saturday(),
            schedule_sunday: specialty.get_schedule_sunday()         
        };
    }

    /**
     * Maps an Specialty response to an Specialty entity.
     * @param {SpecialtyResponse} raw - The Specialty response.
     * @returns {Specialty} The Specialty entity.
     */
    static from_response_to_domain(raw: SpecialtyResponse): Specialty {
        return new Specialty(
            new ObjectId(raw._id),
            raw.name,
            raw.schedule_monday,
            raw.schedule_tuesday,
            raw.schedule_wednesday,
            raw.schedule_thursday,
            raw.schedule_friday,
            raw.schedule_saturday,
            raw.schedule_sunday
        );
    }

    /**
     * Maps an Specialty entity to an Specialty response.
     * @param {Specialty} specialty - The Specialty entity.
     * @returns {SpecialtyResponse} The Specialty response.
     */
    static from_domain_to_response(specialty: Specialty): SpecialtyResponse {
        return {
            _id: specialty.get_id().toHexString(),
            name: specialty.get_name(),
            schedule_monday: specialty.get_schedule_monday(),
            schedule_tuesday: specialty.get_schedule_tuesday(),
            schedule_wednesday: specialty.get_schedule_wednesday(),
            schedule_thursday: specialty.get_schedule_thursday(),
            schedule_friday: specialty.get_schedule_friday(),
            schedule_saturday: specialty.get_schedule_saturday(),
            schedule_sunday: specialty.get_schedule_sunday()
        };
    }
}