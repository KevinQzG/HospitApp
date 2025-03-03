import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
    try {
        return NextResponse.json({ message: "API funcionando correctamente" });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}