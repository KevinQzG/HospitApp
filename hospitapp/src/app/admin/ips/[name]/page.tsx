"use server";

import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ENV } from "@/config/env";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

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
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

type ReviewsResult = {
  reviews: Review[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    pageSize: number;
  };
};

type LookIpsResponse = {
  success: boolean;
  error?: string;
  data?: IpsResponse;
  reviewsResult?: ReviewsResult;
};

type AuthResponse = {
  success: boolean;
  user?: { role: string };
  error?: string;
  message?: string;
};

type IpsDetailPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsDetailPage({ params }: IpsDetailPageProps) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  console.log("Cookies disponibles en el servidor:", cookieStore.getAll());

  if (!sessionToken) {
    console.log("No session token found in cookies, redirecting to home");
    redirect("/");
  }

  console.log("Session token encontrado:", sessionToken);

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

  if (!authResponse.ok || !authResponse.headers.get("content-type")?.includes("application/json")) {
    console.error("Authentication failed - Response not OK or not JSON:", {
      status: authResponse.status,
      contentType: authResponse.headers.get("content-type"),
    });
    redirect("/");
  }

  const authData: AuthResponse = await authResponse.json();
  console.log("Auth response data:", authData);

  if (!authData.success) {
    console.log("Authentication failed - Success is false:", {
      message: authData.message,
      error: authData.error,
    });
    redirect("/");
  }

  const userRole = authData.user?.role?.toUpperCase();
  if (userRole !== "ADMIN") {
    console.log("User does not have ADMIN role:", { userRole });
    redirect("/");
  }

  const resolvedParams = await params;
  console.log("Resolved params:", resolvedParams);

  const name = resolvedParams?.name;
  if (!name) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            Error: Nombre de IPS no proporcionado
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            No se proporcionó un nombre de IPS válido en la URL.
          </p>
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
        </div>
      </section>
    );
  }

  const decodedName = decodeURIComponent(name);
  console.log("Decoded name:", decodedName);

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
        sorts: [
          { field: "rating", direction: -1 },
          { field: "updatedAt", direction: 1 },
        ],
      }),
    });

    console.log("IPS fetch response status:", response.status);
    console.log("IPS fetch response headers:", response.headers.get("content-type"));

    if (!response.ok) {
      const errorData: LookIpsResponse = await response.json();
      console.log("IPS fetch error data:", errorData);
      error = errorData.error || "No se pudo obtener información de la IPS.";
    } else {
      const data: LookIpsResponse = await response.json();
      console.log("IPS fetch response data:", data);
      ipsData = data.data ?? null;
      if (!ipsData) {
        error = "La IPS no fue encontrada.";
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Ocurrió un error desconocido.";
    console.error("Error in IpsDetailPage:", err);
  }

  if (error || !ipsData) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">
        <div className="text-center max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2 tracking-tight">
            {error ? "Error al cargar la IPS" : "IPS no encontrada"}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || "No hay datos disponibles para esta IPS."}
          </p>
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/ips"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium shadow transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver
            </Link>
            <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
              {ipsData.name}
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-all duration-300">
              <Pencil className="w-4 h-4" />
              Editar
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow transition-all duration-300">
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">📋</span> Información General
              </h2>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Nombre:</span> {ipsData.name}
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Ubicación:</span> {ipsData.department}, {ipsData.town}
                </p>
                <p>
                  <span className="font-medium text-gray-900 dark:text-gray-100">Dirección:</span> {ipsData.address}
                </p>
                {ipsData.phone && (
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Teléfono:</span>{" "}
                    <a href={`tel:${ipsData.phone}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {ipsData.phone}
                    </a>
                  </p>
                )}
                {ipsData.email && (
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Correo:</span>{" "}
                    <a href={`mailto:${ipsData.email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {ipsData.email}
                    </a>
                  </p>
                )}
                {ipsData.level && (
                  <p>
                    <span className="font-medium text-gray-900 dark:text-gray-100">Nivel:</span> {ipsData.level}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">👥</span> EPS Aceptadas
              </h2>
              {ipsData.eps && ipsData.eps.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {ipsData.eps.map((eps) => (
                    <div
                      key={eps._id}
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {eps.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No hay EPS asociadas.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 transition-all duration-300 hover:shadow-xl">
              <h2 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400">🩺</span> Especialidades
              </h2>
              {ipsData.specialties && ipsData.specialties.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {ipsData.specialties.map((specialty) => (
                    <div
                      key={specialty._id}
                      className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-center text-gray-800 dark:text-gray-200 font-medium transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {specialty.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No hay especialidades asociadas.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}