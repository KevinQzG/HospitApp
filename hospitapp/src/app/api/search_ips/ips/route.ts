import { NextRequest, NextResponse } from "next/server";
import { IpsResponse } from "@/models/ips.interface";
import { createIps } from "@/services/search_ips/data_fetching.service";

/**
 * Interface representing the structure of the create request body
 * @interface CreateIpsRequest
 * @property {string} name - The name of the IPS document
 * @property {string} address - The address of the IPS
 * @property {string} phone - The contact phone number
 */
interface CreateIpsRequest {
    name: string;
    address: string;
    phone: string;
}

/**
 * Interface representing the structure of the create response
 * @interface CreateIpsResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IpsResponse} [data] - Created IPS data if success is true
 */
export interface CreateIpsResponse {
    success: boolean;
    error?: string;
    data?: IpsResponse;
}

/**
 * Function to validate the body of the request
 * @param {CreateIpsRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const VALIDATE_REQUEST_BODY = (body: CreateIpsRequest): { success: boolean; error: string } => {
    if (!body.name || !body.address || !body.phone) {
        return { success: false, error: "Missing required fields: name, address, phone" };
    }
    if (typeof body.name !== "string" || typeof body.address !== "string" || typeof body.phone !== "string") {
        return { success: false, error: "Invalid types: name, address, and phone must be strings" };
    }
    return { success: true, error: "" };
};

/**
 * POST endpoint for creating a new IPS
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
export async function POST(req: NextRequest): Promise<NextResponse<CreateIpsResponse>> {
    try {
        // Parse and validate request body
        const BODY: CreateIpsRequest = await req.json();

        // Body validation
        const { success: SUCCESS, error: ERROR } = VALIDATE_REQUEST_BODY(BODY);
        if (!SUCCESS) {
            return NextResponse.json({ success: false, error: ERROR }, { status: 400 });
        }

        // Create IPS
        const NEW_IPS = await createIps(BODY);

        return NextResponse.json({
            success: true,
            data: NEW_IPS
        }, { status: 201 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
