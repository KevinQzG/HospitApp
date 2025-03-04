import { ObjectId } from "mongodb";
import { IPSDocument, IPSResponse } from "@/models/ips.interface";
import { IPS } from "@/models/ips";
import { EPSMapper } from './eps_mapper';
import { SpecialtyMapper } from './specialty_mapper';

/**
 * Class that allows to map IPS entities from domain to document and vice versa.
 * @class IpsMapper
 */
export class IpsMapper {
    /**
     * Maps an IPS document to an IPS entity.
     * @param {IPSDocument} raw - The IPS document.
     * @returns {IPS} The IPS entity.
     */
    static from_document_to_domain(raw: IPSDocument): IPS {
        return new IPS(
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
     * @param {IPS} ips - The IPS entity.
     * @returns {IPSDocument} The IPS document.
     */
    static from_domain_to_document(ips: IPS): IPSDocument {
        return {
            _id: ips.getId(),
            name: ips.getName(),
            department: ips.getDepartment(),
            town: ips.getTown(),
            address: ips.getAddress(),
            phone: ips.getPhone(),
            email: ips.getEmail(),
            location: ips.getLocation(),
            level: ips.getLevel(),
            distance: ips.getDistance(),
            eps: ips.getEPS()?.map(EPSMapper.from_domain_to_document),
            specialties: ips.getSpecialties()?.map(SpecialtyMapper.from_domain_to_document)
        };
    }

    /**
     * Maps an IPS response to an IPS entity.
     * @param {IPSResponse} raw - The IPS response.
     * @returns {IPS} The IPS entity.
     */
    static from_response_to_domain(raw: IPSResponse): IPS {
        return new IPS(
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
     * @param {IPS} ips - The IPS entity.
     * @returns {IPSResponse} The IPS response.
     */
    static from_domain_to_response(ips: IPS): IPSResponse {
        return {
            _id: ips.getId().toHexString(),
            name: ips.getName(),
            department: ips.getDepartment(),
            town: ips.getTown(),
            address: ips.getAddress(),
            phone: ips.getPhone(),
            email: ips.getEmail(),
            location: ips.getLocation(),
            level: ips.getLevel(),
            distance: ips.getDistance(),
            eps: ips.getEPS()?.map(EPSMapper.from_domain_to_response),
            specialties: ips.getSpecialties()?.map(SpecialtyMapper.from_domain_to_response)
        };
    }
}