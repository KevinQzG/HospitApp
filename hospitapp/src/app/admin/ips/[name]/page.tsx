"use server";

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ENV } from "@/config/env";
import { ArrowLeft } from "lucide-react";
import IpsActions from "./IpsActions";

type IpsResponse = {
  _id: string;
  name: string;
  department: string;
  town: string;
  address: string;
  phone?: string;
  email?: string;
  rating?: number;
  level?: string;
  eps?: { _id: string; name: string }[];
  specialties?: { _id: string; name: string }[];
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
};

type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
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

  const resolvedParams = await params;
  const name = resolvedParams?.name;
  if (!name) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md bg-gray-800 rounded-3xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-gray-100 mb-3 tracking-tight">
            Nombre de IPS no proporcionado
          </h1>
          <p className="text-gray-400 mb-6 text-sm">
            No se proporcionó un nombre de IPS válido en la URL.
          </p>
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  const decodedName = decodeURIComponent(name);
  let ipsData: IpsResponse | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/v1.0.0/ips/get/pagination`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${sessionToken}`,
      },
      body: JSON.stringify({
        name: decodedName,
        reviewsPage: 1,
        reviewsPageSize: 5,
        sorts: [{ field: "rating", direction: -1 }, { field: "updatedAt", direction: 1 }],
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      error = data.error || "No se pudo obtener información de la IPS.";
    } else {
      ipsData = data.data ?? null;
      if (!ipsData) error = "La IPS no fue encontrada.";
    }
  } catch {
    error = "Ocurrió un error inesperado.";
  }

  if (error || !ipsData) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md bg-gray-800 rounded-3xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-gray-100 mb-3 tracking-tight">
            {error ? "Error al cargar la IPS" : "IPS no encontrada"}
          </h1>
          <p className="text-gray-400 mb-6 text-sm">
            {error || "No hay datos disponibles para esta IPS."}
          </p>
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Name and Actions */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href="/admin/ips"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-100 tracking-tight break-words max-w-[calc(100%-120px)] sm:max-w-[calc(100%-200px)]">
              {ipsData.name}
            </h1>
          </div>
          {/* Usa el componente IpsActions para los botones */}
          <IpsActions id={ipsData._id} name={ipsData.name} />
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Información General */}
          <section className="md:col-span-2">
            <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-lg font-medium text-gray-100 mb-4">Información General</h2>
              <dl className="space-y-3 text-sm text-gray-400">
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                  <dt className="font-medium text-gray-100">Nombre:</dt>
                  <dd className="break-words">{ipsData.name}</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                  <dt className="font-medium text-gray-100">Ubicación:</dt>
                  <dd>{ipsData.department}, {ipsData.town}</dd>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                  <dt className="font-medium text-gray-100">Dirección:</dt>
                  <dd>{ipsData.address}</dd>
                </div>
                {ipsData.phone && (
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                    <dt className="font-medium text-gray-100">Teléfono:</dt>
                    <dd>
                      <a href={`tel:${ipsData.phone}`} className="text-blue-400 hover:underline">
                        {ipsData.phone}
                      </a>
                    </dd>
                  </div>
                )}
                {ipsData.email && (
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                    <dt className="font-medium text-gray-100">Correo:</dt>
                    <dd>
                      <a href={`mailto:${ipsData.email}`} className="text-blue-400 hover:underline">
                        {ipsData.email}
                      </a>
                    </dd>
                  </div>
                )}
                {ipsData.level && (
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                    <dt className="font-medium text-gray-100">Nivel:</dt>
                    <dd>{ipsData.level}</dd>
                  </div>
                )}
              </dl>
            </div>
          </section>

          {/* EPS Aceptadas */}
          <section className="md:col-span-1">
            <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-lg font-medium text-gray-100 mb-4">EPS Aceptadas</h2>
              {ipsData.eps && ipsData.eps.length > 0 ? (
                <ul className="space-y-2">
                  {ipsData.eps.map((eps) => (
                    <li
                      key={eps._id}
                      className="bg-gray-700 rounded-xl p-2 text-center text-sm text-gray-200 transition-all duration-200 hover:bg-gray-600"
                    >
                      {eps.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400">No hay EPS asociadas.</p>
              )}
            </div>
          </section>

          {/* Especialidades */}
          <section className="md:col-span-3">
            <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-lg font-medium text-gray-100 mb-4">Especialidades</h2>
              {ipsData.specialties && ipsData.specialties.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {ipsData.specialties.map((specialty) => (
                    <div
                      key={specialty._id}
                      className="bg-gray-700 rounded-xl p-3 text-center text-sm text-gray-200 transition-all duration-200 hover:bg-gray-600"
                    >
                      {specialty.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No hay especialidades asociadas.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}