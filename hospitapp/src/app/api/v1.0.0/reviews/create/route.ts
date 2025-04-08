import { NextRequest, NextResponse } from "next/server";
import ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import UserServiceAdapter from "@/adapters/services/user.service.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { getSessionToken } from "@/utils/helpers/session";
import { TokenExpiredError } from "jsonwebtoken";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the create request body
 * @interface CreateReviewRequest
 * @property {string} ips - The ips of the review
 * @property {number} rating - The rating of the review
 * @property {string} comments - The comments of the review
 */
interface CreateReviewRequest {
	ips: string;
	rating: number;
	comments: string;
}

/**
 * Interface representing the structure of the create response
 * @interface CreateReviewResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IpsResponse | null} [data] - The data returned from the request
 */
export interface CreateReviewResponse {
	success: boolean;
	error?: string;
	review?: string | null;
}

/**
 * Function to validate the body of the request
 * @param {CreateReviewRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: CreateReviewRequest
): { success: boolean; error: string } => {
	if (!body.ips) {
		return { success: false, error: "Missing required field: ips" };
	} else if (typeof body.ips !== "string") {
		return {
			success: false,
			error: "Invalid type for field: ips, expected string",
		};
	}

	if (body.rating === undefined) {
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
 *   "review": ...
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
): Promise<NextResponse<CreateReviewResponse>> {
	// Inject the dependencies
	const REVIEW_SERVICE = CONTAINER.get<ReviewServiceAdapter>(
		TYPES.ReviewServiceAdapter
	);
	const USER_SERVICE = CONTAINER.get<UserServiceAdapter>(
		TYPES.UserServiceAdapter
	);
	try {
		// Parse and validate request body
		const BODY: CreateReviewRequest = await req.json();
		const COOKIE = req.headers.get("cookie") ?? "";
		const TOKEN_DATA = getSessionToken(COOKIE);
		if (!TOKEN_DATA) {
			return NextResponse.json(
				{ success: false, error: "Unauthorized" },
				{ status: 401 }
			);
		}

		const USER = await USER_SERVICE.getUserByEmail(TOKEN_DATA.email);

		if (!USER) {
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

		const REVIEW = await REVIEW_SERVICE.create(
			BODY.ips,
			USER._id,
			BODY.rating,
			BODY.comments,
		);

		return NextResponse.json({
			success: true,
			review: REVIEW,
		});
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return NextResponse.json(
				{ success: false, error: "Session expired" },
				{ status: 500 }
			);
		}
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal server error" },
			{ status: 500 }
		);
	}
}
