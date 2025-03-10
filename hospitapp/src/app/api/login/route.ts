import { NextApiRequest, NextApiResponse } from "next";
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
 * @param {LoginRequest} body - The request body to validate
 * @returns {{ success: boolean; error: string }} True if the body is valid, false otherwise with an error message
 */

 const validate_request_body = (body: LoginRequest): { success: boolean; error: string } => {
    if (!body.email) {
        return { success: false, error: "Missing required field: email" };
    } else if (typeof body.email !== "string") {
        return { success: false, error: "Invalid type for field: email, expected string" }; 
    }
    if (!body.password) {
        return { success: false, error: "Missing required field: password" };
    } else if (typeof body.password !== "string") {
        return { success: false, error: "Invalid type for field: password, expected string" }; 
    }
    return { success: true, error: "" };
}



export default async (req: NextApiRequest, res: NextApiResponse) => {
    const _DB = _CONTAINER.get<DBAdapter>(_TYPES.DBAdapter);
    const _USER_REPO = _CONTAINER.get<UserRepositoryAdapter>(_TYPES.UserRepositoryAdapter);

    if (req.method === 'POST') {
        const body: LoginRequest = req.body;
        const user = await _USER_REPO.findUserByEmail(body.email);
        if (user && user.compare_password(body.password)) {
            res.json({ success: true });
        } else {
            res.json({ success: false, error: "Invalid email or password." });
        }
    } 
};

