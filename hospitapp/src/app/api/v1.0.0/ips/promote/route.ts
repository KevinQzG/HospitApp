import { NextRequest, NextResponse } from "next/server";
import CONTAINER from "@/adapters/container";
import { TYPES } from "@/adapters/types";
import IpsServiceAdapter from "@/adapters/services/ips.service.adapter";

interface PromoteIPSRequest {
  name: string;
  promoted: number;
}

interface PromoteIPSResponse {
  success: boolean;
  message: string;
}

const VALIDATE_PROMOTION_BODY = (
  body: PromoteIPSRequest
): { success: boolean; error?: string } => {
  if (!body.name) return { success: false, error: "Missing IPS Name" };
  if (body.promoted == undefined) {
    return { success: false, error: "Invalid promotion level" };
  }
  return { success: true };
};


export async function POST(
  req: NextRequest
): Promise<NextResponse<PromoteIPSResponse>> {
  const ipsService = CONTAINER.get<IpsServiceAdapter>(TYPES.IpsServiceAdapter);

  try {
    const body: PromoteIPSRequest = await req.json();

    const { success, error } = VALIDATE_PROMOTION_BODY(body);
    if (!success) {
      return NextResponse.json({ success: false, message: error! }, { status: 400 });
    }
    
    const updateResult = await ipsService.updatePromotedStatus(body.name, Number(body.promoted));

    if (!updateResult) {
      return NextResponse.json({ success: false, message: "IPS not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Promotion rank updated successfully",
    });
  } catch (err) {
    console.error("Error updating promotion rank:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
    
  }
    
}