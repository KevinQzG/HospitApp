import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ENV } from "@/config/env";
import { ArrowLeft } from "lucide-react";
import EditForm from "./EditForm";

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

type LookIpsResponse = {
  success: boolean;
  error?: string;
  data?: IpsResponse;
};

type AuthResponse = {
  success: boolean;
  user?: { role: string };
  error?: string;
  message?: string;
};

type IpsEditPageProps = {
  params: Promise<{ name: string }>;
};

export default async function IpsEditPage({ params }: IpsEditPageProps) {
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

  const authData: AuthResponse = await authResponse.json();
  if (!authResponse.ok || !authData.success || authData.user?.role?.toUpperCase() !== "ADMIN") {
    redirect("/");
  }

  const { name } = await params;
  const decodedName = decodeURIComponent(name);
  console.log("Nombre decodificado:", decodedName); // Para depuración

  let ipsData: IpsResponse | null = null;
  let error: string | null = null;
  let loading = true;

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

    if (!response.ok) {
      const errorData: LookIpsResponse = await response.json();
      error = errorData.error || "No se pudo obtener información de la IPS.";
    } else {
      const data: LookIpsResponse = await response.json();
      ipsData = data.data ?? null;
      if (!ipsData) {
        error = "La IPS no fue encontrada.";
      }
    }
  } catch {
    error = "Ocurrió un error inesperado.";
  } finally {
    loading = false;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900/80 backdrop-blur-md flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-700/50">
          <h1 className="text-xl font-semibold text-gray-100 mb-3 tracking-tight">
            Cargando...
          </h1>
          <p className="text-gray-400 text-sm">
            Por favor, espera mientras cargamos la información de la IPS.
          </p>
        </div>
      </div>
    );
  }

  if (error || !ipsData) {
    return (
      <div className="min-h-screen bg-gray-900/80 backdrop-blur-md flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-gray-700/50">
          <h1 className="text-xl font-semibold text-gray-100 mb-3 tracking-tight">
            {error ? "Error al cargar la IPS" : "IPS no encontrada"}
          </h1>
          <p className="text-gray-400 text-sm">
            {error || "No hay datos disponibles para esta IPS."}
          </p>
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-full bg-gray-700/80 text-gray-200 hover:bg-gray-600 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900/80 backdrop-blur-md text-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-800/70 rounded-xl p-4 shadow-md border border-gray-700/50">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Link
              href={`/admin/ips/${encodeURIComponent(ipsData.name)}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
            <h1 className="text-2xl font-semibold text-gray-100 tracking-tight break-words">
              Editar IPS: {ipsData.name}
            </h1>
          </div>
        </header>
        <div className="bg-gray-800/70 rounded-xl p-6 shadow-md border border-gray-700/50">
          <EditForm ipsData={ipsData} sessionToken={sessionToken} />
        </div>
      </div>
    </div>
  );
}