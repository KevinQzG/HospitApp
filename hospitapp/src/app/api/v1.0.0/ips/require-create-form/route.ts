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
    console.log("Received create form request:", BODY);

    const { success, error } = VALIDATE_IPS_BODY(BODY);

    if (!success) {
      console.log("Validation failed:", error);
      return NextResponse.json(
        { success: false, message: error, response: "" },
        { status: 400 }
      );
    }

    console.log("Sending create form email to:", BODY.email);
    const RESULT = await EMAIL_SERVICE.send(
      "moderadores@tuservicio.com",
      "Moderador IPS",
      `
        Nueva solicitud de creación de IPS:
        - Nombre: ${BODY.ipsName}
        - Dirección: ${BODY.address}
        - Teléfono: ${BODY.phone}
        - Email: ${BODY.email}
        - Mensaje: ${BODY.message}
      `,
      "Solicitud de creación de IPS"
    );
    console.log("Email service response:", RESULT);

    return NextResponse.json({
      success: RESULT.status,
      message: RESULT.message,
      response: RESULT.response,
    });
    //@typescript-eslint/no-unused-vars
  } catch (error) {
    console.error("Error in create form API:", error);
    return NextResponse.json(
      {
        error: error,
        success: false,
        message: "Internal server error",
        response: "Internal server error",
      },
      { status: 500 }
    );
  }
}
