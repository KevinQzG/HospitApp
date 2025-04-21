// src/app/api/session/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

interface DecodedToken {
  email: string;
  expiresIn: string; // viene como string desde el token
}

export async function GET() {
  try {
    const allHeaders = headers();
    const cookieHeader = (await allHeaders).get("cookie") || "";

    const cookiesArray = cookieHeader
      .split(";")
      .map((cookie: string) => cookie.trim());

    const sessionCookie = cookiesArray.find((cookie: string) =>
      cookie.startsWith("session=")
    );

    if (!sessionCookie) {
      return NextResponse.json({ loggedIn: false });
    }

    const token = sessionCookie.split("=")[1];
    const secretKey = process.env.JWT_SECRET_KEY as string;

    if (!secretKey) {
      throw new Error("JWT_SECRET_KEY no está definido");
    }

    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    return NextResponse.json({
      loggedIn: true,
      email: decoded.email,
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    return NextResponse.json({ loggedIn: false });
  }
}
