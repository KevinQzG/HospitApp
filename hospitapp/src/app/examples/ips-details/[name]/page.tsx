"use server";

import Link from "next/link";
import { ENV } from "@/config/env";
import { LookIpsResponse } from "@/app/api/v1.0.0/ips/get/pagination/route";
import IpsDetailClient from "@/components/IpsDetailClient";
import { ArrowLeft } from "lucide-react";

type IpsDetailPageProps = {
	params: Promise<{ name: string }>;
};

export default async function ipsDetailPage({ params }: IpsDetailPageProps) {
	const resolvedParams = await params;
	const { name } = resolvedParams;
	const decodedName = decodeURIComponent(name);

	let ipsDate: LookIpsResponse["data"] | null = null;
	let reviewsResult: LookIpsResponse["reviewsResult"] | null = null;
	let error: string | null = null;

	try {
		const response = await fetch(
			`${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/ips/get/pagination`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: decodedName,
					reviewsPage: 1,
					reviewsPageSize: 5,
					sorts: [
						{ field: "rating", direction: -1 },
						{ field: "updatedAt", direction: 1 },
					],
				}),
			}
		);

		if (!response.ok) {
			const errorData: LookIpsResponse = await response.json();
			error =
				errorData.error || "No se pudo obtener información de la IPS.";
		} else {
			const data: LookIpsResponse = await response.json();
			ipsDate = data.data;
      reviewsResult = data.reviewsResult;
			if (!ipsDate) {
				error = "La IPS no fue encontrada.";
			}
		}
	} catch (err) {
		error =
			err instanceof Error
				? err.message
				: "Ocurrió un error desconocido.";
	}

	if (error || !ipsDate) {
		return (
			<section className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors">
				<div className="text-center max-w-md">
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
						{error ? "Error al cargar la IPS" : "IPS no encontrada"}
					</h1>
					<p className="text-gray-600 dark:text-gray-300 mb-6">
						{error || "No hay datos disponibles para esta IPS."}
					</p>

					<Link
						href="/results"
						className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-all"
					>
						<ArrowLeft className="w-4 h-4" />
						Volver a resultados
					</Link>
				</div>
			</section>
		);
	}

	return <IpsDetailClient ipsData={ipsDate} initialReviewsResult={reviewsResult ?? null}/>;
}
