import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;

  // Si no hay token, redirigir a Home
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Decodificar el JWT (simplemente usando `atob`)
  try {
    const [, payloadBase64] = sessionToken.split(".");
    const payload = JSON.parse(atob(payloadBase64));

    const role = payload?.user?.role;

    if (role?.toUpperCase() !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Rol autorizado, continuar
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid JWT format or decoding error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
