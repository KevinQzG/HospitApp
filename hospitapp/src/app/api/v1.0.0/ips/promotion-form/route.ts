import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import EmailServiceAdapter from "@/adapters/services/sendEmail.service.adapter";

/**
 * Interface representing the structure of the send promotion email request
 * @interface SendPromotionEmailRequest
 * @property {string} email - The email address of the recipient
 * @property {string} name - The name of the recipient
 * @property {string} message - The message to be sent
 */
interface SendPromotionEmailRequest {
  email: string;
  name: string;
  message: string;
}

/**
 * Interface representing the structure of the send promotion email response
 * @interface SendPromotionEmailResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [message] - Success message if success is true
 * @property {string} [response] - Response from the email service
 */
interface SendPromotionEmailResponse {
  success: boolean;
  message: string;
  response: string;
}

/**
 * Function to validate the body of the request
 * @param {SendPromotionEmailRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (
  body: SendPromotionEmailRequest
): { success: boolean; error: string } => {
  if (!body.name) {
    return { success: false, error: "Missing required field: name" };
  } else if (typeof body.name !== "string") {
    return {
      success: false,
      error: "Invalid type for field: name, expected string",
    };
  }

  if (!body.email) {
    return { success: false, error: "Missing required field: email" };
  } else if (typeof body.email !== "string") {
    return {
      success: false,
      error: "Invalid type for field: email, expected string",
    };
  }

  if (!body.message) {
    return { success: false, error: "Missing required field: message" };
  } else if (typeof body.message !== "string") {
    return {
      success: false,
      error: "Invalid type for field: message, expected string",
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
): Promise<NextResponse<SendPromotionEmailResponse>> {
  const SEARCH_SERVICE: EmailServiceAdapter =
    CONTAINER.get<EmailServiceAdapter>(TYPES.EmailServiceAdapter);
  try {
    // Parse and validate request body
    const BODY: SendPromotionEmailRequest = await req.json();
    console.log("Received promotion form request:", BODY);

    // Body validation
    const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
    if (!SUCCESS) {
      console.log("Validation failed:", ERROR);
      return NextResponse.json(
        { success: false, message: ERROR, response: "" },
        { status: 400 }
      );
    }

    console.log("Sending promotion email to:", BODY.email);
    const RESULT = await SEARCH_SERVICE.send(
      BODY.email,
      BODY.name,
      BODY.message,
      "Solicitud de promoción"
    );
    console.log("Email service response:", RESULT);

    return NextResponse.json({
      success: RESULT.status,
      message: RESULT.message,
      response: RESULT.response,
    });
  } catch (error) {
    console.error("Error in promotion form API:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        response: "Internal server error",
      },
      { status: 500 }
    );
  }
}
