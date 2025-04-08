// src/app/api/v1.0.0/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSessionToken } from "@/utils/helpers/session";

/**
 * Interface representing the structure of the response for getting authentication data
 * @interface GetAuthDataResponse
 * @property {boolean} success - Indicates whether the request was successful
 * @property {string} [error] - Error message if success is false
 * @property {string} [email] - Email of the user if success is true
 */
export interface GetAuthDataResponse {
  success: boolean;
  error?: string;
  email?: string | null;
}

export async function GET(req: NextRequest): Promise<NextResponse<GetAuthDataResponse>> {
  try {
    const COOKIE = req.headers.get("cookie") ?? "";
    const TOKEN_DATA = getSessionToken(COOKIE);
    if (!TOKEN_DATA) {
		return NextResponse.json({ success: false, email: null });
    }
    return NextResponse.json({ success: true, email: TOKEN_DATA.email });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}