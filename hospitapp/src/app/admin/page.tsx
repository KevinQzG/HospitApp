"use client";

import { useRouter } from "next/navigation";
import { Edit, Star, Hospital } from "lucide-react";

const adminDashboard = () => {
  const router = useRouter();

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

export default adminDashboard;
