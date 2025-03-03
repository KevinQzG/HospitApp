import { NextRequest, NextResponse } from "next/server";
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import { is_type_array } from "@/utils/helpers/validation";

/**
 * Interface representing the structure of the search request body
 * @interface SearchRequest
 * @property {[number, number]} coordinates - Geographic coordinates [longitude, latitude]
 * @property {number} maxDistance - Maximum search distance in meters
 * @property {string[]} [specialties] - Optional array of medical specialties to filter by
 * @property {string[]} [eps_names] - Optional array of EPS names to filter by
 * @property {number} [page] - Optional page number for pagination (default: 1)
 * @property {number} [page_size] - Optional number of items per page (default: 10)
 */
interface SearchRequest {
    coordinates: [number, number];
    max_distance: number;
    specialties?: string[];
    eps_names?: string[];
    page?: number;
    page_size?: number;
}

/**
 * Function to validate the body of the request
 * @param {SearchRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const validate_request_body = (body: SearchRequest): { success: boolean; error: string } => {
    if (!body.coordinates) {
        return { success: false, error: "Invalid request: coordinates is required." };
    } else if (!is_type_array(body.coordinates, "number", 2)) {
        return { success: false, error: "Invalid request: coordinates must be an array of two numbers [longitude, latitude]." };
    } else if (!body.max_distance) {
        return { success: false, error: "Invalid request: maximum distance in meters is required." };
    } else if (typeof body.max_distance !== "number") {
        return { success: false, error: "Invalid request: maximum distance must be a number representing meters." };
    } else if (body.specialties && !is_type_array(body.specialties, "string")) {
        return { success: false, error: "Invalid request: specialties must be an array of strings." };
    } else if (body.eps_names && !is_type_array(body.eps_names, "string")) {
        return { success: false, error: "Invalid request: EPS names must be an array of strings." };
    } else if (body.page && typeof body.page !== "number") {
        return { success: false, error: "Invalid request: page must be a number." };
    } else if (body.page_size && typeof body.page_size !== "number") {
        return { success: false, error: "Invalid request: page size must be a number." };
    }

    return { success: true, error: "" };
};

/**
 * POST endpoint for searching IPS (Instituciones Prestadoras de Servicios de Salud)
 * @async
 * @function POST
 * @param {NextRequest} req - Next.js request object
 * @returns {Promise<NextResponse>} - JSON response with results or error message
 * 
 * @example
 * // Successful response
 * {
 *   "success": true,
 *   "data": [...],
 *   "pagination": {
 *     "total": 25,
 *     "total_pages": 3,
 *     "page": 1,
 *     "page_size": 10
 *   }
 * }
 * 
 * @example
 * // Error response
 * {
 *   "success": false,
 *   "error": "Internal server error"
 * }
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    const _DB_HANDLER: DBAdapter = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
    const _SEARCH_SERVICE: SearchIpsServiceAdapter = _CONTAINER.get<SearchIpsServiceAdapter>(
        _TYPES.SearchIpsServiceAdapter
    );
    try {
        // Parse and validate request body
        const body: SearchRequest = await req.json();

        // Body validation
        const { success, error } = validate_request_body(body);
        if (!success) {
            return NextResponse.json({ success: false, error }, { status: 400 });
        }

        const { results, total } = await _SEARCH_SERVICE.filter(
            body.coordinates[0], // longitude
            body.coordinates[1], // latitude
            body.max_distance,
            body.specialties || [],
            body.eps_names || [],
            body.page || 1,
            body.page_size || 10
        );

        await _DB_HANDLER.close();

        return NextResponse.json({
            success: true,
            data: results,
            pagination: {
                total,
                total_pages: Math.ceil(total / (body.page_size || 10)),
                page: body.page || 1,
                page_size: body.page_size || 10,
            },
        });
    } catch (error) {
        await _DB_HANDLER.close();
        
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}