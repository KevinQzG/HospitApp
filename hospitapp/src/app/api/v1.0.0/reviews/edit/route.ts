import { NextRequest, NextResponse } from "next/server";
import { ReviewResponse } from "@/models/review.interface";
import ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import UserServiceAdapter from "@/adapters/services/user.service.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { getSessionToken } from "@/utils/helpers/session";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the edit request body
 * @interface EditReviewRequest
 * @property {string} id - The id of the review to edit
 * @property {number} rating - The rating of the review
 * @property {string} comments - The comments of the review
 */
interface EditReviewRequest {
	id: string;
	rating: number;
	comments: string;
}

/**
 * Interface representing the structure of the get response
 * @interface GetReviewResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IpsResponse | null} [data] - The data returned from the request
 */
export interface GetReviewResponse {
	success: boolean;
	error?: string;
	data?: ReviewResponse | null;
}

/**
 * Function to validate the body of the request
 * @param {EditReviewRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: EditReviewRequest
): { success: boolean; error: string } => {
	if (!body.id) {
		return { success: false, error: "Missing required field: id" };
	} else if (typeof body.id !== "string") {
		return {
			success: false,
			error: "Invalid type for field: id, expected string",
		};
	}

	if (!body.rating) {
		return { success: false, error: "Missing required field: rating" };
	} else if (typeof body.rating !== "number") {
		return {
			success: false,
			error: "Invalid type for field: rating, expected number",
		};
	}

	if (!body.comments) {
		return { success: false, error: "Missing required field: comments" };
	} else if (typeof body.comments !== "string") {
		return {
			success: false,
			error: "Invalid type for field: comments, expected string",
		};
	}

	return { success: true, error: "" };
};

/**
 * POST endpoint for fetching a review by ID
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
): Promise<NextResponse<GetReviewResponse>> {
	// Inject the dependencies
	const REVIEW_SERVICE = CONTAINER.get<ReviewServiceAdapter>(
		TYPES.ReviewServiceAdapter
	);
	const USER_SERVICE = CONTAINER.get<UserServiceAdapter>(
		TYPES.UserServiceAdapter
	);
	try {
		// Parse and validate request body
		const BODY: EditReviewRequest = await req.json();
		const COOKIE = req.headers.get("cookie") ?? "";
		const TOKEN_DATA = getSessionToken(COOKIE);
		if (!TOKEN_DATA) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, error: ERROR },
				{ status: 400 }
			);
		}

		let review = await REVIEW_SERVICE.findById(BODY.id);

		if (!review) {
			return NextResponse.json(
				{ success: false, error: "Review not found" },
				{ status: 404 }
			);
		} else if (review.userEmail !== TOKEN_DATA.email) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		review = await REVIEW_SERVICE.update(
			BODY.id,
			review.ips,
			review.user,
			BODY.rating,
			BODY.comments
		);

		return NextResponse.json({
			success: true,
			data: review,
		});
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
