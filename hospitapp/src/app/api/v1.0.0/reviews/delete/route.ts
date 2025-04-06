import { NextRequest, NextResponse } from "next/server";
import { ReviewResponse } from "@/models/review.interface";
import ReviewServiceAdapter from "@/adapters/services/review.service.adapter";
import UserServiceAdapter from "@/adapters/services/user.service.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import { getSessionToken } from "@/utils/helpers/session";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the delete request body
 * @interface DeleteReviewRequest
 * @property {string} id - The id of the review to delete
 */
interface DeleteReviewRequest {
	id: string;
}

/**
 * Interface representing the structure of the delete response
 * @interface DeleteReviewResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 */
export interface DeleteReviewResponse {
	success: boolean;
	message: string;
}

/**
 * Function to validate the body of the request
 * @param {DeleteReviewRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: DeleteReviewRequest
): { success: boolean; error: string } => {
	if (!body.id) {
		return { success: false, error: "Missing required field: id" };
	} else if (typeof body.id !== "string") {
		return {
			success: false,
			error: "Invalid type for field: id, expected string",
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
 *   "message": "Review deleted successfully"
 * }
 *
 * @example
 * // Error response
 * {
 *   "success": false,
 *   "message": "Internal server error"
 * }
 */
export async function POST(
	req: NextRequest
): Promise<NextResponse<DeleteReviewResponse>> {
	// Inject the dependencies
	const REVIEW_SERVICE = CONTAINER.get<ReviewServiceAdapter>(
		TYPES.ReviewServiceAdapter
	);
	const USER_SERVICE = CONTAINER.get<UserServiceAdapter>(
		TYPES.UserServiceAdapter
	);
	try {
		// Parse and validate request body
		const BODY: DeleteReviewRequest = await req.json();
		const COOKIE = req.headers.get("cookie") ?? "";
		const TOKEN_DATA = getSessionToken(COOKIE);
		if (!TOKEN_DATA) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}
		console.log("TOKEN_DATA", TOKEN_DATA);

		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, message: ERROR },
				{ status: 400 }
			);
		}

		const review = await REVIEW_SERVICE.findById(BODY.id);

		if (!review) {
			return NextResponse.json(
				{ success: false, message: "Review not found" },
				{ status: 404 }
			);
		} else if (review.userEmail !== TOKEN_DATA.email && !USER_SERVICE.verifyUserRole(TOKEN_DATA.email, "ADMIN")) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		// Delete the review
		if (await REVIEW_SERVICE.delete(BODY.id)) {
			return NextResponse.json({
				success: true,
				message: "Review deleted successfully",
			});
		} else {
			return NextResponse.json(
				{ success: false, message: "Failed to delete review" },
				{ status: 500 }
			);
		}
	} catch (error) {
		console.error("API Error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
