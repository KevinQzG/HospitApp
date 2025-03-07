import { NextRequest, NextResponse } from "next/server";
import { IpsResponse } from "@/models/ips.interface";
import { get_ips_props } from '@/services/search_ips/data_fetching.service';
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the search request body
 * @interface LookIpsRequest
 * @property {string} name - The name of the IPS document
 */
interface LookIpsRequest {
    name: string
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
}

/**
 * Function to validate the body of the request
 * @param {LookIpsRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const validate_request_body = (body: LookIpsRequest): { success: boolean; error: string } => {
    if (!body.name) {
        return { success: false, error: "Missing required field: name" };
    } else if (typeof body.name !== "string") {
        return { success: false, error: "Invalid type for field: name, expected string" };
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
export async function POST(req: NextRequest): Promise<NextResponse<LookIpsResponse>> {
    try {
        // Parse and validate request body
        const _BODY: LookIpsRequest = await req.json();

        // Body validation
        const { success: _SUCCESS, error: _ERROR } = validate_request_body(_BODY);
        if (!_SUCCESS) {
            return NextResponse.json({ success: false, error: _ERROR }, { status: 400 });
        }

        const _IPS = await get_ips_props({ name: _BODY.name });

        if (!_IPS) {
            return NextResponse.json({ success: false, error: "IPS not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: _IPS
        });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}