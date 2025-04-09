"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import Link from "next/link";

type CreateFormProps = {
  sessionToken: string;
};

export default function CreateForm({ sessionToken }: CreateFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateForm = (formData: FormData) => {
    const errors: { [key: string]: string } = {};
    const name = formData.get("name") as string;
    const department = formData.get("department") as string;
    const town = formData.get("town") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    if (!name) errors.name = "El nombre es obligatorio.";
    if (!department) errors.department = "El departamento es obligatorio.";
    if (!town) errors.town = "La ciudad es obligatoria.";
    if (!address) errors.address = "La dirección es obligatoria.";
    if (!phone) errors.phone = "El teléfono es obligatorio.";
    if (!email) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "El correo electrónico no es válido.";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setFormDataToSubmit(formData);
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    if (!formDataToSubmit) return;

    setError(null);
    setSuccessMessage(null);
    setShowConfirm(false);

    const newIps = {
      name: formDataToSubmit.get("name") as string,
      department: formDataToSubmit.get("department") as string,
      town: formDataToSubmit.get("town") as string,
      address: formDataToSubmit.get("address") as string,
      phone: formDataToSubmit.get("phone") as string,
      email: formDataToSubmit.get("email") as string,
      level: formDataToSubmit.get("level") as string,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(formDataToSubmit.get("longitude") as string) || 0,
          parseFloat(formDataToSubmit.get("latitude") as string) || 0,
        ],
      },
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1.0.0/ips/crud`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionToken}`,
        },
        body: JSON.stringify({ ips: newIps }),
      });

      if (response.ok) {
        const createdData = await response.json();
        setSuccessMessage("IPS creada con éxito");
        setTimeout(() => {
          router.push(`/admin/ips/${encodeURIComponent(createdData.name)}`);
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "No se pudo crear la IPS");
      }
    } catch {
      setError("Ocurrió un error inesperado.");
    }
  };

  return (
    <div className="bg-gray-800 rounded-3xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <h2 className="text-lg font-medium text-gray-100 mb-4">Crear Nueva IPS</h2>
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
              ¿Estás seguro de crear esta IPS?
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción agregará una nueva IPS al sistema. ¿Deseas continuar?
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
                className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-500 text-sm font-medium transition-all duration-300"
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
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.name ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.name && (
              <p className="text-red-400 text-xs mt-1">{formErrors.name}</p>
            )}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-100 mb-1">
              Departamento
            </label>
            <input
              type="text"
              id="department"
              name="department"
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.department ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.department && (
              <p className="text-red-400 text-xs mt-1">{formErrors.department}</p>
            )}
          </div>
          <div>
            <label htmlFor="town" className="block text-sm font-medium text-gray-100 mb-1">
              Ciudad
            </label>
            <input
              type="text"
              id="town"
              name="town"
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.town ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.town && (
              <p className="text-red-400 text-xs mt-1">{formErrors.town}</p>
            )}
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-100 mb-1">
              Dirección
            </label>
            <input
              type="text"
              id="address"
              name="address"
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.address ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.address && (
              <p className="text-red-400 text-xs mt-1">{formErrors.address}</p>
            )}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.phone ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.phone && (
              <p className="text-red-400 text-xs mt-1">{formErrors.phone}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border ${
                formErrors.email ? "border-red-600" : "border-gray-600"
              } focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300`}
            />
            {formErrors.email && (
              <p className="text-red-400 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-100 mb-1">
              Nivel
            </label>
            <input
              type="text"
              id="level"
              name="level"
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-100 mb-1">
              Latitud
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              step="any"
              placeholder="0"
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-100 mb-1">
              Longitud
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              step="any"
              placeholder="0"
              className="w-full px-4 py-2 rounded-xl bg-gray-700 text-gray-200 border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-300"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/ips"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-700 text-gray-200 hover:bg-gray-600 text-sm font-medium transition-all duration-300"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all duration-300"
          >
            Crear IPS
          </button>
        </div>
      </form>
    </div>
  );
}