import { NextRequest, NextResponse } from "next/server";
import { ReviewResponse } from "@/models/review.interface";
import ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { SortCriteria } from "@/repositories/review_mongo.repository.interfaces";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the get all request body
 * @interface AllReviewsRequest
 * @property {number} [page] - Optional page number for reviews
 * @property {number} [pageSize] - Optional page size for reviews
 * @property {SortCriteria[]} [sorts] - Optional array of sorting criteria
 * @property {number} [ratingFilter] - Optional rating filter
 */
interface AllReviewsRequest {
	page?: number;
	pageSize?: number;
	sorts?: SortCriteria[];
	ratingFilter?: number;
}

/**
 * Interface representing the structure of the get all response
 * @interface AllReviewsResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {object} [data] - Review data if success is true
 *
 */
export interface AllReviewsResponse {
	success: boolean;
	error?: string;
	data?: {
		result: ReviewResponse[];
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
 * @param {AllReviewsRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: AllReviewsRequest
): { success: boolean; error: string } => {
	if (body.page && typeof body.page !== "number") {
		return {
			success: false,
			error: "Invalid type for field: reviewsPage, expected number",
		};
	}

	if (body.pageSize && typeof body.pageSize !== "number") {
		return {
			success: false,
			error: "Invalid type for field: reviewsPageSize, expected number",
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
 * POST endpoint for retrieving all reviews with pagination and sorting
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
): Promise<NextResponse<AllReviewsResponse>> {
	// Inject the dependencies
	const REVIEW_SERVICE = CONTAINER.get<ReviewServiceAdapter>(
		TYPES.ReviewServiceAdapter
	);
	try {
		// Parse and validate request body
		const BODY: AllReviewsRequest = await req.json();

		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, error: ERROR },
				{ status: 400 }
			);
		}

		const RESULT = await REVIEW_SERVICE.findAllWithPagination(
			BODY.page || 1,
			BODY.pageSize || 10,
			undefined,
			BODY.sorts,
			BODY.ratingFilter
		);

		return NextResponse.json({
			success: true,
			data: {
				result: RESULT.results,
				pagination: {
					total: RESULT.total,
					totalPages: Math.ceil(
						RESULT.total /
							(BODY.pageSize || 10)
					),
					page: BODY.page || 1,
					pageSize: BODY.pageSize || 10,
				},
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
