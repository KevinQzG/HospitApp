import { ObjectId } from "mongodb";
import { IpsDocument, IpsResponse } from "@/models/ips.interface";
import { Ips } from "@/models/ips";
import { EpsMapper } from "./eps_mapper";
import { SpecialtyMapper } from "./specialty_mapper";
import { ReviewMapper } from "./review_mapper";

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
	static fromDocumentToDomain(raw: IpsDocument): Ips {
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
			raw.eps?.map(EpsMapper.fromDocumentToDomain),
			raw.specialties?.map(SpecialtyMapper.fromDocumentToDomain),
			raw.reviews?.map(ReviewMapper.fromDocumentToDomain),
			raw.totalReviews,
			raw.rating,
			raw.promotion
		);
	}

	/**
	 * Maps an IPS entity to an IPS document.
	 * @param {Ips} ips - The IPS entity.
	 * @returns {IpsDocument} The IPS document.
	 */
	static fromDomainToDocument(ips: Ips): IpsDocument {
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
			eps: ips.getEps()?.map(EpsMapper.fromDomainToDocument),
			specialties: ips
				.getSpecialties()
				?.map(SpecialtyMapper.fromDomainToDocument),
			reviews: ips.getReviews()?.map(ReviewMapper.fromDomainToDocument),
			totalReviews: ips.getTotalReviews(),
			rating: ips.getRating(),
			promotion: ips.getPromotion(),
		};
	}

	/**
	 * Maps an IPS response to an IPS entity.
	 * @param {IpsResponse} raw - The IPS response.
	 * @returns {Ips} The IPS entity.
	 */
	static fromResponseToDomain(raw: IpsResponse): Ips {
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
			raw.eps?.map(EpsMapper.fromResponseToDomain),
			raw.specialties?.map(SpecialtyMapper.fromResponseToDomain),
			raw.reviews?.map(ReviewMapper.fromResponseToDomain),
			raw.totalReviews,
			raw.rating,
			raw.promotion,
		);
	}

	/**
	 * Maps an IPS entity to an IPS response.
	 * @param {Ips} ips - The IPS entity.
	 * @returns {IpsResponse} The IPS response.
	 */
	static fromDomainToResponse(ips: Ips): IpsResponse {
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
			eps: ips.getEps()?.map(EpsMapper.fromDomainToResponse),
			specialties: ips
				.getSpecialties()
				?.map(SpecialtyMapper.fromDomainToResponse),
			reviews: ips.getReviews()?.map(ReviewMapper.fromDomainToResponse),
			totalReviews: ips.getTotalReviews(),
			rating: ips.getRating(),
			promotion: ips.getPromotion(),
		};
	}
}
