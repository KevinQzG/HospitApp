import { NextRequest, NextResponse } from "next/server";
import { IpsResponse } from "@/models/ips.interface";
import { ReviewResponse } from "@/models/review.interface";
import { getIpsPropsWithReviews } from "@/services/cachers/ips.data_fetching.service";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the search request body
 * @interface LookIpsRequest
 * @property {string} name - The name of the IPS document
 * @property {number} [reviewsPage] - Optional page number for reviews
 * @property {number} [reviewsPageSize] - Optional page size for reviews
 */
interface LookIpsRequest {
	name: string;
	reviewsPage?: number;
	reviewsPageSize?: number;
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
	reviewsResult?: {
		reviews: ReviewResponse[];
		pagination?: {
			total: number;
			totalPages: number;
			page: number;
			pageSize: number;
		};
	};
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

	if (body.reviewsPage && typeof body.reviewsPage !== "number") {
		return {
			success: false,
			error: "Invalid type for field: reviewsPage, expected number",
		};
	}

	if (body.reviewsPageSize && typeof body.reviewsPageSize !== "number") {
		return {
			success: false,
			error: "Invalid type for field: reviewsPageSize, expected number",
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
			reviewsPage: BODY.reviewsPage || 1,
			reviewsPageSize: BODY.reviewsPageSize || 10
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
			reviewsResult: {
				reviews: RESULT.reviewsResult.reviews,
				pagination: {
					total: RESULT.reviewsResult.total,
					totalPages: Math.ceil(RESULT.reviewsResult.total / (BODY.reviewsPageSize || 10)),
					page: BODY.reviewsPage || 1,
					pageSize: BODY.reviewsPageSize || 10,
				}
			},
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
