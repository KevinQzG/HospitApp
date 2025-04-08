import { SpecialtyResponse } from "@/models/specialty.interface";

/**
 * @interface
 * @name SpecialtyServiceAdapter
 * @description This interface should be implemented by the class that will get specialties.
 */
export default interface SpecialtyServiceAdapter {
	/**
	 * Gets all the specialties from the database.
	 * @async
	 * @returns {Promise<Specialty[]>} The specialties from the database.
	 */
	getAllSpecialties(): Promise<SpecialtyResponse[]>;
}
