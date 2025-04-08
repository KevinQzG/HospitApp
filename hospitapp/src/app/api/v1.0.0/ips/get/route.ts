import { NextRequest, NextResponse } from "next/server";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { getIpsPropsWithReviews } from "@/services/cachers/ips.data_fetching.service";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the search request body
 * @interface LookIpsRequest
 * @property {string} name - The name of the IPS document
 * @property {SortCriteria[]} [sorts] - Optional array of sorting criteria
 * @property {number} [ratingFilter] - Optional rating filter
 */
interface LookIpsRequest {
	name: string;
	sorts?: SortCriteria[];
	ratingFilter?: number;
}

/**
 * Interface representing the structure of the search response
 * @interface LookIpsResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IpsResponse} [data] - IPS data if success is true
 */
export interface LookIpsResponse {
	success: boolean;
	error?: string;
	data?: IpsResponse;
	reviewsResult?: ReviewResponse[];
}

/**
 * Function to validate the body of the request
 * @param {LookIpsRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: LookIpsRequest
): { success: boolean; error: string } => {
	if (!body.name) {
		return { success: false, error: "Missing required field: name" };
	} else if (typeof body.name !== "string") {
		return {
			success: false,
			error: "Invalid type for field: name, expected string",
		};
	}

	if (body.sorts && !Array.isArray(body.sorts)) {
		return {
			success: false,
			error: "Invalid type for field: sorts, expected array",
		};
	}

	if (body.ratingFilter && typeof body.ratingFilter !== "number" && (body.ratingFilter < 1 || body.ratingFilter > 5)) {
		return {
			success: false,
			error: "Invalid type for field: ratingFilter, expected number between 1 and 5",
		};
	}

	return { success: true, error: "" };
};

/**
 * POST endpoint for retrieving an IPS with a given ID
 * @async
 * @function POST
 * @param {NextRequest} req - Next.js request object
 * @returns {Promise<NextResponse>} - JSON response with results or error message
 *
 * @example
 * // Successful response
 * {
 *   "success": true,
 *   "data": ...
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
): Promise<NextResponse<LookIpsResponse>> {
	try {
		// Parse and validate request body
		const BODY: LookIpsRequest = await req.json();

		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, error: ERROR },
				{ status: 400 }
			);
		}

		const RESULT = await getIpsPropsWithReviews({
			name: BODY.name,
			sorts: BODY.sorts,
			ratingFilter: BODY.ratingFilter,
		});
		

		if (!RESULT.ips) {
			return NextResponse.json(
				{ success: false, error: "IPS not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			data: RESULT.ips,
			reviewsResult: RESULT.reviewsResult,
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
