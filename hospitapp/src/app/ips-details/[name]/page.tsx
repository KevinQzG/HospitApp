"use server";

import Link from "next/link";
import { _ENV } from "@/config/env";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";
import IpsDetailClient from "@/components/IpsDetailClient";
import { ArrowLeft } from "lucide-react";

type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
  const resolvedParams = await params;
  const { name } = resolvedParams;
  const decodedName = decodeURIComponent(name);

  let IPS_DATA: LookIpsResponse["data"] | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`${_ENV.NEXT_PUBLIC_API_URL}/search_ips/ips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: decodedName }),
    });

    if (!response.ok) {
      const errorData: LookIpsResponse = await response.json();
      error = errorData.error || "Failed to fetch IPS data";
    } else {
      const data: LookIpsResponse = await response.json();
      IPS_DATA = data.data;
      if (!IPS_DATA) {
        error = "IPS not found";
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error occurred";
  }

  if (error || !IPS_DATA) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 sm:text-3xl">
            {error ? "Error Loading IPS" : "IPS Not Found"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{error || "No data available"}</p>
          <Link
            href="/results"
            className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a resultados
          </Link>
        </div>
      </div>
    );
  }

  return <IpsDetailClient ipsData={IPS_DATA} />;
}