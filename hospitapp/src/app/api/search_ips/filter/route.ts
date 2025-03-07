import { NextRequest, NextResponse } from "next/server";
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import SearchIpsServiceAdapter from "@/adapters/search_ips.service.adapter";
import { _TYPES } from "@/adapters/types";
import { is_type_array } from "@/utils/helpers/validation";
import { IpsResponse } from "@/models/ips.interface";
// import { revalidateTag } from 'next/cache'; // For revalidation of the data caching page (Not needed in this file)

/**
 * Interface representing the structure of the search request body
 * @interface SearchRequest
 * @property {[number, number]} coordinates - Optional Geographic coordinates [longitude, latitude]
 * @property {number} maxDistance - Optional Maximum search distance in meters
 * @property {string[]} [specialties] - Optional array of medical specialties to filter by
 * @property {string[]} [eps_names] - Optional array of EPS names to filter by
 * @property {number} [page] - Optional page number for pagination (default: 1)
 * @property {number} [page_size] - Optional number of items per page (default: 10)
 */
interface SearchRequest {
    coordinates?: [number, number];
    max_distance?: number;
    specialties?: string[];
    eps_names?: string[];
    page?: number;
    page_size?: number;
}

/**
 * Interface representing the structure of the search response
 * @interface SearchResponse
 * @property {boolean} success - True if the request was successful, false otherwise
 * @property {string} [error] - Error message if success is false
 * @property {IPSDocument[]} [data] - Array of IPS documents
 * @property {{ total: number; total_pages: number; page: number; page_size: number; }} [pagination] - Pagination information
 */
export interface SearchResponse {
    success: boolean;
    error?: string;
    data?: IpsResponse[];
    pagination?: {
        total: number;
        total_pages: number;
        page: number;
        page_size: number;
    };
}

/**
 * Function to validate the body of the request
 * @param {SearchRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */
const validate_request_body = (body: SearchRequest): { success: boolean; error: string } => {
    if (body.coordinates && !is_type_array(body.coordinates, "number", 2)) {
        return { success: false, error: "Invalid request: coordinates must be an array of two numbers [longitude, latitude]." };
    } else if (body.max_distance && typeof body.max_distance !== "number") {
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
export async function POST(req: NextRequest): Promise<NextResponse<SearchResponse>> {
    const _DB_HANDLER: DBAdapter = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
    const _SEARCH_SERVICE: SearchIpsServiceAdapter = _CONTAINER.get<SearchIpsServiceAdapter>(
        _TYPES.SearchIpsServiceAdapter
    );
    try {
        // Parse and validate request body
        const _BODY: SearchRequest = await req.json();

        // Body validation
        const { success: _SUCCESS, error: _ERROR } = validate_request_body(_BODY);
        if (!_SUCCESS) {
            return NextResponse.json({ success: false, error: _ERROR }, { status: 400 });
        }
        let latitude: number | null = null;
        let longitude: number | null = null;
        if (_BODY.coordinates) {
            longitude = _BODY.coordinates[0];
            latitude = _BODY.coordinates[1];
        }

        const { results: _RESULTS, total: _TOTAL } = await _SEARCH_SERVICE.filter_ips(
            longitude,
            latitude,
            _BODY.max_distance || null,
            _BODY.specialties || [],
            _BODY.eps_names || [],
            _BODY.page || 1,
            _BODY.page_size || 10
        );

        await _DB_HANDLER.close();
        // revalidateTag('search-config'); // For revalidation of the data caching page (Not needed in this file)
        return NextResponse.json({
            success: true,
            data: _RESULTS,
            pagination: {
                total: _TOTAL,
                total_pages: Math.ceil(_TOTAL / (_BODY.page_size || 10)),
                page: _BODY.page || 1,
                page_size: _BODY.page_size || 10,
            }
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