// src/app/api/v1.0.0/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/utils/helpers/session";
import UserServiceAdapter from "@/adapters/services/user.service.adapter";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";

/**
 * Interface representing the structure of the request for validating authentication data
 * @interface ValidateAuthDataRequest
 * @property {boolean} authenticationNeeded - Indicates whether authentication is needed
 * @property {string[]} [authenticationRoles] - Optional array of roles required for authentication
 */
interface ValidateAuthDataRequest {
	authenticationNeeded: boolean;
	authenticationRoles?: string[];
}

/**
 * Interface representing the structure of the response for validating authentication data
 * @interface ValidateAuthDataResponse
 * @property {boolean} success - Indicates whether the request was successful
 * @property {string} [error] - Error message if success is false
 * @property {string} [email] - Email of the user if success is true
 */
export interface ValidateAuthDataResponse {
	success: boolean;
	message: string;
}

/**
 * Function to validate the body of the request
 * @param {SearchRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
	body: ValidateAuthDataRequest
): { success: boolean; error: string } => {
	if (body.authenticationNeeded === undefined || body.authenticationNeeded === null) {
		return {
			success: false,
			error: "Missing required field: authenticationNeeded",
		};
	} else if (
		body.authenticationRoles &&
		!Array.isArray(body.authenticationRoles)
	) {
		return {
			success: false,
			error: "Invalid type for field: authenticationRoles, expected array of strings",
		};
	}

	return { success: true, error: "" };
};

export async function POST(
	req: NextRequest
): Promise<NextResponse<ValidateAuthDataResponse>> {
  const USER_SERVICE = CONTAINER.get<UserServiceAdapter>(
		TYPES.UserServiceAdapter
	);
	try {
    const BODY: ValidateAuthDataRequest = await req.json();
		// Body validation
		const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
		if (!SUCCESS) {
			return NextResponse.json(
				{ success: false, message: ERROR },
				{ status: 400 }
			);
		}

    if (!BODY.authenticationNeeded) {
      return NextResponse.json({ success: true, message: "User Not Authentication Needed" });
    }

		const COOKIE = req.headers.get("cookie") ?? "";
		const TOKEN_DATA = getSessionToken(COOKIE);
    
		if ((!TOKEN_DATA || !TOKEN_DATA.email) && BODY.authenticationNeeded) {
			return NextResponse.json({ success: false, message: "User Not Authenticated" });
		}

    if (TOKEN_DATA && BODY.authenticationRoles && BODY.authenticationRoles.length > 0) {
      const USER_ROLE = (await USER_SERVICE.getUserByEmail(TOKEN_DATA.email))?.role;
      if (!USER_ROLE || !BODY.authenticationRoles.includes(USER_ROLE)) {
        return NextResponse.json({ success: false, message: "User Not Authorized" });
      }
    }
		return NextResponse.json({ success: true, message: "User Authenticated" });
	} catch {
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
