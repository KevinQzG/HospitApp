import { NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import UserRepositoryAdapter from "@/adapters/repositories/user_repository.adapter";
import { TYPES } from "@/adapters/types";
import { createSession } from "@/utils/helpers/session";

export interface LoginRequest {
	email: string;
	password: string;
}

const validateRequestBody = (
	body: LoginRequest
): { success: boolean; error: string } => {
	if (!body.email)
		return { success: false, error: "Missing required field: email" };
	if (typeof body.email !== "string")
		return { success: false, error: "Invalid type for email" };
	if (!body.password)
		return { success: false, error: "Missing required field: password" };
	if (typeof body.password !== "string")
		return { success: false, error: "Invalid type for password" };

	return { success: true, error: "" };
};

export async function POST(request: Request) {
	const userRepo = CONTAINER.get<UserRepositoryAdapter>(
		TYPES.UserRepositoryAdapter
	);

	try {
		const body: LoginRequest = await request.json();
		const validation = validateRequestBody(body);

		if (!validation.success) {
			return NextResponse.json(
				{ success: false, error: validation.error },
				{ status: 400 }
			);
		}

		const user = await userRepo.findUserByEmail(body.email);
		if (user && user.comparePassword(body.password)) {
			console.log("creating something");
			const session = createSession(user.getEmail());

			const response = NextResponse.json(
				{ success: true },
				{ status: 200 }
			);

			response.headers.set(
				"Set-Cookie",
				`session=${session}; Path=/; HttpOnly; SameSite=Strict; Max-Age=3600`
			);

			console.log(response.body);
			return response;
		}

		return NextResponse.json(
			{ success: false, error: "Invalid email or password." },
			{ status: 401 }
		);
	} catch {
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
