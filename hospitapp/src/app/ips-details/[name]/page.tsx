"use server";

import Link from "next/link";
import { _ENV } from "@/config/env";
import { LookIpsResponse } from "@/app/api/search_ips/ips/route";
import IpsDetailClient from "@/components/IpsDetailClient";
import { ArrowLeft } from "lucide-react";

type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function ips_detail_page({ params }: IpsDetailPageProps) {
  const _resolvedParams = await params;
  const { name: _name } = _resolvedParams;
  const _decodedName = decodeURIComponent(_name);

  let ips_data: LookIpsResponse["data"] | null = null;
  let error: string | null = null;

  try {
    const _response = await fetch(`${_ENV.NEXT_PUBLIC_API_URL}/search_ips/ips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: _decodedName }),
    });

    if (!_response.ok) {
      const _errorData: LookIpsResponse = await _response.json();
      error = _errorData.error || "Failed to fetch IPS data";
    } else {
      const _data: LookIpsResponse = await _response.json();
      ips_data = _data.data;
      if (!ips_data) {
        error = "IPS not found";
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error occurred";
  }

  if (error || !ips_data) {
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

  return <IpsDetailClient ipsData={ips_data} />;
}