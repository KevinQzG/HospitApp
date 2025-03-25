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
    static fromDocumentToDomain(raw: SpecialtyDocument): Specialty {
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
    static fromDomainToDocument(specialty: Specialty): SpecialtyDocument {
        return {
            _id: specialty.getId(),
            name: specialty.getName(),
            "schedule_monday": specialty.getScheduleMonday(),
            "schedule_tuesday": specialty.getScheduleTuesday(),
            "schedule_wednesday": specialty.getScheduleWednesday(),
            "schedule_thursday": specialty.getScheduleThursday(),
            "schedule_friday": specialty.getScheduleFriday(),
            "schedule_saturday": specialty.getScheduleSaturday(),
            "schedule_sunday": specialty.getScheduleSunday()         
        };
    }

    /**
     * Maps an Specialty response to an Specialty entity.
     * @param {SpecialtyResponse} raw - The Specialty response.
     * @returns {Specialty} The Specialty entity.
     */
    static fromResponseToDomain(raw: SpecialtyResponse): Specialty {
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
    static fromDomainToResponse(specialty: Specialty): SpecialtyResponse {
        return {
            _id: specialty.getId().toHexString(),
            name: specialty.getName(),
            "schedule_monday": specialty.getScheduleMonday(),
            "schedule_tuesday": specialty.getScheduleTuesday(),
            "schedule_wednesday": specialty.getScheduleWednesday(),
            "schedule_thursday": specialty.getScheduleThursday(),
            "schedule_friday": specialty.getScheduleFriday(),
            "schedule_saturday": specialty.getScheduleSaturday(),
            "schedule_sunday": specialty.getScheduleSunday()
        };
    }
}