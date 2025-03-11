import { NextResponse } from "next/server";
import DBAdapter from '@/adapters/db.adapter';
import _CONTAINER from "@/adapters/container";
import UserRepositoryAdapter from "@/adapters/user_repository.adapter";
import { _TYPES } from "@/adapters/types";

export interface LoginRequest {
    email: string;
    password: string;
}

/**
 * Function to validate the body of the request
 */
const validate_request_body = (body: LoginRequest): { success: boolean; error: string } => {
    if (!body.email) return { success: false, error: "Missing required field: email" };
    if (typeof body.email !== "string") return { success: false, error: "Invalid type for email" };
    
    if (!body.password) return { success: false, error: "Missing required field: password" };
    if (typeof body.password !== "string") return { success: false, error: "Invalid type for password" };

    return { success: true, error: "" };
};


export async function POST(request: Request) {
    const _DB = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
    const _USER_REPO = _CONTAINER.get<UserRepositoryAdapter>(_TYPES.UserRepositoryAdapter);

    try {
        const body: LoginRequest = await request.json();
        
        const validation = validate_request_body(body);
        
        if (!validation.success) {
            return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
        }

        const user = await _USER_REPO.findUserByEmail(body.email);
        if (user && user.compare_password(body.password)) {
            return NextResponse.json({ success: true }, { status: 200 });
        } else {
            
            return NextResponse.json({ success: false, error: "Invalid email or password." }, { status: 401 });
        }

    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 401 });
    }
}
