// src/app/api/session/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const allHeaders = await headers();
    const cookieHeader = allHeaders.get("cookie") || "";

    const cookiesArray: string[] = cookieHeader
      .split(";")
      .map((cookie: string) => cookie.trim());

    const sessionCookie = cookiesArray.find((cookie: string) =>
      cookie.startsWith("session=")
    );

    if (!sessionCookie) {
      return NextResponse.json({ loggedIn: false });
    }

    const token = sessionCookie.split("=")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);

    return NextResponse.json({ loggedIn: true, user: decoded });
  } catch (error) {
    console.error("Error verificando token:", error);
    return NextResponse.json({ loggedIn: false });
  }
}