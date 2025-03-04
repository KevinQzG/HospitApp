import { ObjectId } from "mongodb";
import { IpsDocument, IpsResponse } from "@/models/ips.interface";
import { Ips } from "@/models/ips";
import { EPSMapper } from './eps_mapper';
import { SpecialtyMapper } from './specialty_mapper';

/**
 * Class that allows to map IPS entities from domain to document and vice versa.
 * @class IpsMapper
 */
export class IpsMapper {
    /**
     * Maps an IPS document to an IPS entity.
     * @param {IpsDocument} raw - The IPS document.
     * @returns {Ips} The IPS entity.
     */
    static from_document_to_domain(raw: IpsDocument): Ips {
        return new Ips(
            raw._id,
            raw.name,
            raw.department,
            raw.town,
            raw.address,
            raw.location,
            raw.phone,
            raw.email,
            raw.level,
            raw.distance,
            raw.eps?.map(EPSMapper.from_document_to_domain),
            raw.specialties?.map(SpecialtyMapper.from_document_to_domain)
        );
    }

    /**
     * Maps an IPS entity to an IPS document.
     * @param {Ips} ips - The IPS entity.
     * @returns {IpsDocument} The IPS document.
     */
    static from_domain_to_document(ips: Ips): IpsDocument {
        return {
            _id: ips.get_id(),
            name: ips.get_name(),
            department: ips.get_department(),
            town: ips.get_town(),
            address: ips.get_address(),
            phone: ips.get_phone(),
            email: ips.get_email(),
            location: ips.get_location(),
            level: ips.get_level(),
            distance: ips.get_distance(),
            eps: ips.get_eps()?.map(EPSMapper.from_domain_to_document),
            specialties: ips.get_specialties()?.map(SpecialtyMapper.from_domain_to_document)
        };
    }

    /**
     * Maps an IPS response to an IPS entity.
     * @param {IpsResponse} raw - The IPS response.
     * @returns {Ips} The IPS entity.
     */
    static from_response_to_domain(raw: IpsResponse): Ips {
        return new Ips(
            new ObjectId(raw._id),
            raw.name,
            raw.department,
            raw.town,
            raw.address,
            raw.location,
            raw.phone,
            raw.email,
            raw.level,
            raw.distance,
            raw.eps?.map(EPSMapper.from_response_to_domain),
            raw.specialties?.map(SpecialtyMapper.from_response_to_domain)
        );
    }

    /**
     * Maps an IPS entity to an IPS response.
     * @param {Ips} ips - The IPS entity.
     * @returns {IpsResponse} The IPS response.
     */
    static from_domain_to_response(ips: Ips): IpsResponse {
        return {
            _id: ips.get_id().toHexString(),
            name: ips.get_name(),
            department: ips.get_department(),
            town: ips.get_town(),
            address: ips.get_address(),
            phone: ips.get_phone(),
            email: ips.get_email(),
            location: ips.get_location(),
            level: ips.get_level(),
            distance: ips.get_distance(),
            eps: ips.get_eps()?.map(EPSMapper.from_domain_to_response),
            specialties: ips.get_specialties()?.map(SpecialtyMapper.from_domain_to_response)
        };
    }
}