"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit, Star, Hospital } from "lucide-react";

type AuthResponse = {
  success: boolean;
  user?: { role: string };
  error?: string;
};

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/v1.0.0/auth/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            authenticationNeeded: true,
            authenticationRoles: ["ADMIN"],
          }),
        });

        if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
          throw new Error("Authentication failed or invalid response");
        }

        const authData: AuthResponse = await response.json();
        if (!authData.success) {
          // Si no está autenticado o no es admin, redirigir
          router.push(authData.error === "User Not Authenticated" ? "/login" : "/");
          return;
        }

        // Si es admin, continuar
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setLoading(false);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2 text-gray-400">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
          </svg>
          <span className="text-lg">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-red-400 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-7xl">
        {/* Centered Header Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-medium text-gray-100">
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-400 mt-4">
            Gestiona las IPS y las reseñas de manera eficiente.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card: Editar IPS */}
          <div
            onClick={() => router.push("/admin/ips")}
            className="bg-gray-800 rounded-2xl p-8 flex items-center gap-6 hover:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer shadow-md"
          >
            <div className="p-5 bg-blue-900 rounded-full">
              <Hospital className="w-12 h-12 text-blue-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-gray-100">Editar IPS</h2>
              <p className="text-base text-gray-400 mt-2">
                Gestiona la información de las instituciones prestadoras de
                salud.
              </p>
            </div>
            <Edit className="w-8 h-8 text-gray-500" />
          </div>

          {/* Card: Editar Reviews */}
          <div
            onClick={() => router.push("/admin/reviews")}
            className="bg-gray-800 rounded-2xl p-8 flex items-center gap-6 hover:bg-gray-700 transition-all duration-300 ease-in-out cursor-pointer shadow-md"
          >
            <div className="p-5 bg-yellow-900 rounded-full">
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-medium text-gray-100">
                Editar Reviews
              </h2>
              <p className="text-base text-gray-400 mt-2">
                Administra las reseñas y calificaciones de los usuarios.
              </p>
            </div>
            <Edit className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;