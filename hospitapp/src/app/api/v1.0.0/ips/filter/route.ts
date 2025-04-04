import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";
import { TYPES } from "@/adapters/types";
import { IS_TYPE_ARRAY } from "@/utils/helpers/validation";
import { IpsResponse } from "@/models/ips.interface";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the search request body
 * @interface SearchRequest
 * @property {[number, number]} coordinates - Optional Geographic coordinates [longitude, latitude]
 * @property {number} maxDistance - Optional Maximum search distance in meters
 * @property {string[]} [specialties] - Optional array of medical specialties to filter by
 * @property {string[]} [eps_names] - Optional array of EPS names to filter by
 * @property {string} [town] - Optional town name to filter by
 * @property {boolean} [hasReviews] - Optional flag to filter by IPS with reviews (default: false)
 */
interface SearchRequest {
	coordinates?: [number, number];
	maxDistance?: number;
	specialties?: string[];
	epsNames?: string[];
	town?: string;
	hasReviews?: boolean;
}

/**
 * Interface representing the structure of the search response
 * @interface SearchResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IPSDocument[]} [data] - Array of IPS documents
 * @property {{ total: number; total_pages: number; page: number; page_size: number; }} [pagination] - Pagination information
 */
export interface SearchResponse {
	success: boolean;
	error?: string;
	data?: IpsResponse[];
}

/**
 * Function to validate the body of the request
 * @param {SearchRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: SearchRequest
): { success: boolean; error: string } => {
	if (body.coordinates && !IS_TYPE_ARRAY(body.coordinates, "number", 2)) {
		return {
			success: false,
			error: "Invalid request: coordinates must be an array of two numbers [longitude, latitude].",
		};
	} else if (body.maxDistance && typeof body.maxDistance !== "number") {
		return {
			success: false,
			error: "Invalid request: maximum distance must be a number representing meters.",
		};
	} else if (body.specialties && !IS_TYPE_ARRAY(body.specialties, "string")) {
		return {
			success: false,
			error: "Invalid request: specialties must be an array of strings.",
		};
	} else if (body.epsNames && !IS_TYPE_ARRAY(body.epsNames, "string")) {
		return {
			success: false,
			error: "Invalid request: EPS names must be an array of strings.",
		};
	} else if (body.town && typeof body.town !== "string") {
		return {
			success: false,
			error: "Invalid request: town must be a string.",
		};
	} else if (
		body.hasReviews !== undefined &&
		typeof body.hasReviews !== "boolean"
	) {
		return {
			success: false,
			error: "Invalid request: hasReviews must be a boolean.",
		};
	}

	return { success: true, error: "" };
};

/**
 * POST endpoint for searching IPS (Instituciones Prestadoras de Servicios de Salud)
 * @async
 * @function POST
 * @param {NextRequest} req - Next.js request object
 * @returns {Promise<NextResponse>} - JSON response with results or error message
 *
 * @example
 * // Successful response
 * {
 *   "success": true,
 *   "data": [...],
 * }
 *
 * @example
 * // Error response
 * {
 *   "success": false,
 *   "error": "Internal server error"
 * }
 */
export async function POST(
	req: NextRequest
): Promise<NextResponse<SearchResponse>> {
	const SEARCH_SERVICE: IpsServiceAdapter = CONTAINER.get<IpsServiceAdapter>(
		TYPES.IpsServiceAdapter
	);
	try {
		// Parse and validate request body
		const BODY: SearchRequest = await req.json();

		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, error: ERROR },
				{ status: 400 }
			);
		}
		let latitude: number | null = null;
		let longitude: number | null = null;
		if (BODY.coordinates) {
			longitude = BODY.coordinates[0];
			latitude = BODY.coordinates[1];
		}

		const RESULTS = await SEARCH_SERVICE.filterIps(
			longitude,
			latitude,
			BODY.maxDistance || null,
			BODY.specialties || [],
			BODY.epsNames || [],
			BODY.town || null,
			BODY.hasReviews || false
		);

		// revalidateTag('search-config'); // For revalidation of the data caching page (Not needed in this file)
		return NextResponse.json({
			success: true,
			data: RESULTS,
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
