// src/repositories/mappers/ips_mapper.ts
import { IPSDocument } from "@/models/ips.interface";
import { IPS } from "@/models/ips";

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
    static to_domain(raw: IPSDocument): IPS {
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
            raw.distance
        );
    }

    /**
     * Maps an IPS entity to an IPS document.
     * @param {IPS} ips - The IPS entity.
     * @returns {IPSDocument} The IPS document.
     */
    static to_document(ips: IPS): IPSDocument {
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
            distance: ips.getDistance()
        };
    }
}