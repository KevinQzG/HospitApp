// src/app/api/session/route.ts

import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const all_headers = await headers();
    const cookie_header = all_headers.get("cookie") || "";

    const cookies_array: string[] = cookie_header
      .split(";")
      .map((cookie: string) => cookie.trim());

    const session_cookie = cookies_array.find((cookie: string) =>
      cookie.startsWith("session=")
    );

    if (!session_cookie) {
      return NextResponse.json({ loggedIn: false });
    }

    const token = session_cookie.split("=")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    return NextResponse.json({ loggedIn: true, user: decoded });
  } catch (error) {
    console.error("Error verificando token:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
