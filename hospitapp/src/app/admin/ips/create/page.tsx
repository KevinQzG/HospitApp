"use server";

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ENV } from "@/config/env";
import { ArrowLeft } from "lucide-react";
import CreateForm from "./CreateForm";

export default async function IpsCreatePage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/");
  }

  const authResponse = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/auth/verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session=${sessionToken}`,
    },
    body: JSON.stringify({
      authenticationNeeded: true,
      authenticationRoles: ["ADMIN"],
    }),
  });

  const authData = await authResponse.json();
  if (!authResponse.ok || !authData.success || authData.user?.role?.toUpperCase() !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href="/admin/ips"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-100 tracking-tight">
              Agregar Nueva IPS
            </h1>
          </div>
        </header>
        <CreateForm sessionToken={sessionToken} />
      </div>
    </div>
  );
}