import { NextResponse } from "next/server";
//import DBAdapter from '@/adapters/db.adapter';
import CONTAINER from "@/adapters/container";
import UserRepositoryAdapter from "@/adapters/repositories/user_repository.adapter";
import { TYPES } from "@/adapters/types";
import {genSalt, hash,  } from "bcrypt-ts";

export interface RegisterRequest {
	email: string;
	password: string;
	phone: string;
	eps: string;
}

/**
 * Function to validate the body of the request
 */
const validateRequestBody = (
	body: RegisterRequest
): { success: boolean; error: string } => {
	if (!body.email)
		return { success: false, error: "Missing required field: email" };
	if (typeof body.email !== "string")
		return { success: false, error: "Invalid type for email" };

	if (!body.password)
		return { success: false, error: "Missing required field: password" };
	if (typeof body.password !== "string")
		return { success: false, error: "Invalid type for password" };

	if (!body.phone)
		return { success: false, error: "Missing required field: phone" };
	if (typeof body.phone !== "string")
		return { success: false, error: "Invalid type for phone" };

	if (!body.eps)
		return { success: false, error: "Missing required field: eps" };
	if (typeof body.eps !== "string")
		return { success: false, error: "Invalid type for eps" };

	return { success: true, error: "" };
};

export async function POST(request: Request) {
	//const DB = CONTAINER.get<DBAdapter>(TYPES.DBAdapter); never used
	const USER_REPO = CONTAINER.get<UserRepositoryAdapter>(
		TYPES.UserRepositoryAdapter
	);

	try {
		const body: RegisterRequest = await request.json();
		const validation = validateRequestBody(body);

		if (!validation.success) {
			return NextResponse.json(
				{ success: false, error: validation.error },
				{ status: 400 }
			);
		}
		const salt = await genSalt(1);
		const hashedPassword = await hash(body.password, salt);
		const res = await USER_REPO.createUser(
			body.eps,
			body.email,
			hashedPassword,
			"USER",
			body.phone
		);

		if (res) {
			return NextResponse.json({ success: true }, { status: 200 });
		} else {
			return NextResponse.json(
				{ success: false, error: "Invalid email or password." },
				{ status: 401 }
			);
		}
	} catch (error) {
		console.error("Error al autenticar:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
