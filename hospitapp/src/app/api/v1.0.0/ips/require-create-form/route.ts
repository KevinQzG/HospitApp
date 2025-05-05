// src/app/api/ips-request/route.ts
import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import EmailServiceAdapter from "@/adapters/services/sendEmail.service.adapter";

interface CreateIPSRequest {
  ipsName: string;
  address: string;
  phone: string;
  email: string;
  message: string;
}

interface CreateIPSResponse {
  success: boolean;
  message: string;
  response: string;
}

const VALIDATE_IPS_BODY = (
  body: CreateIPSRequest
): { success: boolean; error: string } => {
  if (!body.ipsName || typeof body.ipsName !== "string") {
    return { success: false, error: "Invalid or missing IPS name" };
  }
  if (!body.address || typeof body.address !== "string") {
    return { success: false, error: "Invalid or missing address" };
  }
  if (!body.phone || typeof body.phone !== "string") {
    return { success: false, error: "Invalid or missing phone" };
  }
  if (!body.email || typeof body.email !== "string") {
    return { success: false, error: "Invalid or missing email" };
  }
  if (!body.message || typeof body.message !== "string") {
    return { success: false, error: "Invalid or missing message" };
  }
  return { success: true, error: "" };
};

export async function POST(
  req: NextRequest
): Promise<NextResponse<CreateIPSResponse>> {
  const EMAIL_SERVICE: EmailServiceAdapter = CONTAINER.get<EmailServiceAdapter>(
    TYPES.EmailServiceAdapter
  );

  try {
    const BODY: CreateIPSRequest = await req.json();
    const { success, error } = VALIDATE_IPS_BODY(BODY);

    if (!success) {
      return NextResponse.json(
        { success: false, message: error, response: "" },
        { status: 400 }
      );
    }

    const message = `
      Nueva solicitud de creación de IPS:
      - Nombre: ${BODY.ipsName}
      - Dirección: ${BODY.address}
      - Teléfono: ${BODY.phone}
      - Email: ${BODY.email}
      - Mensaje: ${BODY.message}
    `;

    const result = await EMAIL_SERVICE.send(
      "moderadores@tuservicio.com",
      "Moderador IPS",
      message,
      "Solicitud de creación de IPS"
    );

    return NextResponse.json({
      success: result.status,
      message: result.message,
      response: result.response,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        response: "Internal server error",
      },
      { status: 500 }
    );
  }
}
