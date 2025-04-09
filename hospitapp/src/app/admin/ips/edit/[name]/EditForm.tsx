"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    const formData = new FormData(e.currentTarget);
    setFormDataToSubmit(formData);
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    if (!formDataToSubmit) return;

    setError(null);
    setSuccessMessage(null);
    setShowConfirm(false);

    const updatedIps = {
      id: ipsData._id,
      name: formDataToSubmit.get("name") as string,
      department: formDataToSubmit.get("department") as string,
      town: formDataToSubmit.get("town") as string,
      address: formDataToSubmit.get("address") as string,
      phone: formDataToSubmit.get("phone") as string,
      email: formDataToSubmit.get("email") as string,
      level: formDataToSubmit.get("level") as string,
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
        setSuccessMessage("Cambios guardados con éxito");
        setTimeout(() => {
          router.push(`/admin/ips/${encodeURIComponent(updatedData.name)}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "No se pudo actualizar la IPS");
      }
    } catch {
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
      {successMessage && (
        <div className="mb-4 p-4 bg-green-900 text-green-200 rounded-xl text-sm">
          {successMessage}
        </div>
      )}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-100 mb-4">
              ¿Estás seguro de guardar los cambios?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción actualizará la información de la IPS. ¿Deseas continuar?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={confirmSubmit}
                className="px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-all duration-300"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
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