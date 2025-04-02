import { EpsResponse } from "@/models/eps.interface";

/**
 * @interface
 * @name EpsServiceAdapter
 * @description This interface should be implemented by the class that will get eps.
 */
export default interface EpsServiceAdapter {
	/**
	 * Gets all the EPSs from the database.
	 * @async
	 * @returns {Promise<EPS[]>} The EPSs from the database.
	 */
	getAllEps(): Promise<EpsResponse[]>;
}
