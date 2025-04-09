"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type EditFormProps = {
  ipsData: {
    _id: string;
    name: string;
    department: string;
    town: string;
    address: string;
    phone?: string;
    email?: string;
    level?: string;
  };
  sessionToken: string;
};

export default function EditForm({ ipsData, sessionToken }: EditFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const updatedIps = {
      id: ipsData._id,
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      town: formData.get("town") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      level: formData.get("level") as string,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1.0.0/ips/crud`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionToken}`,
        },
        body: JSON.stringify({ ips: updatedIps }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        router.push(`/admin/ips/${encodeURIComponent(updatedData.name)}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "No se pudo actualizar la IPS");
      }
    } catch (err) {
      setError("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Editar Información</h2>
      {error && (
        <div className="mb-4 p-4 bg-red-900 text-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}
      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-100 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={ipsData.name}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-100 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="department"
              name="department"
              defaultValue={ipsData.department}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-100 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="town"
              name="town"
              defaultValue={ipsData.town}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-100 mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              defaultValue={ipsData.address}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              defaultValue={ipsData.phone}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={ipsData.email}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-100 mb-1">
              Nivel
            </label>
            <input
              type="text"
              id="level"
              name="level"
              defaultValue={ipsData.level}
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Link
            href={`/admin/ips/${encodeURIComponent(ipsData.name)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all duration-300"
          >
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}