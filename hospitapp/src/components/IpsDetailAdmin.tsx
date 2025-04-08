"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Hospital,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  UserCheck,
  Stethoscope,
  Pencil,
  Trash2,
  Save,
} from "lucide-react";

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

type IpsDetailAdminProps = {
  ipsData: IpsResponse;
};

export default function IpsDetailAdmin({ ipsData }: IpsDetailAdminProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<IpsResponse>>(ipsData);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    try {
      const response = await fetch("/api/v1.0.0/ips/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: ipsData._id,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update IPS");
      }

      window.alert("¡IPS actualizada correctamente!");
      setIsEditing(false);
      router.refresh(); // Refrescar la página para reflejar los cambios
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update IPS");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar esta IPS? Esta acción no se puede deshacer."
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch("/api/v1.0.0/ips/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: ipsData._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete IPS");
      }

      window.alert("¡IPS eliminada correctamente!");
      router.push("/admin/ips");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete IPS");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col transition-colors duration-300">
      <header className="bg-gray-800 shadow-lg rounded-b-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div className="flex items-center space-x-3">
              <Hospital className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <h1 className="text-xl sm:text-2xl font-bold text-gray-100 whitespace-normal break-words max-w-xs sm:max-w-none">
                {ipsData.name}
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              <Link
                href="/admin/ips"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Volver a la lista
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto px-4 py-6 sm:px-6 sm:py-12 w-full">
        <div className="flex justify-end mb-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow transition-all"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleEditSave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow transition-all"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium shadow transition-all"
              >
                Cancelar
              </button>
            </div>
          )}
          <button
            onClick={handleDelete}
            className="ml-4 flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-600 text-white rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
          <section className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4 sm:mb-6 flex items-center">
              <Hospital className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 flex-shrink-0" />
              Información General
            </h2>
            <ul className="space-y-4 sm:space-y-5 text-gray-300 text-sm sm:text-base">
              <li className="flex items-center">
                <span className="font-medium text-gray-100 mr-2">Nombre:</span>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.name}</span>
                )}
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    name="department"
                    value={formData.department || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.department}</span>
                )}
                ,{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="town"
                    value={formData.town || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.town}</span>
                )}
              </li>
              <li className="flex items-center">
                <MapPin size={18} className="mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.address}</span>
                )}
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.phone || "No disponible"}</span>
                )}
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 sm:mr-3 text-blue-400 flex-shrink-0" />
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                  />
                ) : (
                  <span>{ipsData.email || "No disponible"}</span>
                )}
              </li>
              {ipsData.level && (
                <li className="flex items-center">
                  <span className="font-medium text-gray-100 mr-2">Nivel:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="level"
                      value={formData.level || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded bg-gray-700 text-gray-100"
                    />
                  ) : (
                    <span>{ipsData.level}</span>
                  )}
                </li>
              )}
            </ul>
          </section>

          {ipsData.eps && ipsData.eps.length > 0 && (
            <section className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4 sm:mb-6 flex items-center">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 flex-shrink-0" />
                EPS Aceptadas
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ipsData.eps.map((eps) => (
                  <div
                    key={eps._id}
                    className="flex items-center bg-blue-900/50 border border-blue-800 rounded-lg p-3 hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
                  >
                    <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-200">{eps.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {ipsData.specialties && ipsData.specialties.length > 0 && (
            <section className="bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4 sm:mb-6 flex items-center">
                <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mr-2 flex-shrink-0" />
                Especialidades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {ipsData.specialties.map((spec) => (
                  <div
                    key={spec._id}
                    className="flex items-center bg-blue-900/50 border border-blue-800 rounded-lg p-3 hover:bg-blue-800 hover:shadow-sm transition-all duration-300"
                  >
                    <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-200">{spec.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}