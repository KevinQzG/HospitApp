"use server";

import { cookies } from "next/headers";
import { ENV } from "@/config/env";

export async function deleteIps(id: string) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    throw new Error("No session token found");
  }

  const response = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/ips/crud?id=${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${sessionToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete IPS");
  }

  return true;
}