"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  FileText,
  Image,
  Timer,
  Save,
  Trash2,
  UserCheck,
  Stethoscope,
  Mail,
  Phone,
} from "lucide-react";

interface IpsData {
  _id: string;
  name: string;
  address: string;
  description: string;
  image_url?: string;
  promotion_duration?: string;
  department?: string;
  town?: string;
  phone?: string;
  email?: string;
  level?: string;
  eps?: { _id: string; name: string }[];
  specialties?: { _id: string; name: string }[];
  location?: {
    coordinates: [number, number];
  };
}

interface IpsDetailAdminProps {
  id: string;
}

const IpsDetailAdmin = ({ id }: IpsDetailAdminProps) => {
  const [ips, setIps] = useState<IpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Validar que el id no sea undefined o vacío
      if (!id || id === "undefined") {
        setError("ID de la IPS no válido. Redirigiendo a la lista de IPS...");
        setTimeout(() => {
          router.push("/admin/ips");
        }, 3000);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/ips/${id}`);
        if (!res.ok) throw new Error("IPS no encontrada");
        const data = await res.json();
        setIps(data);
      } catch (err) {
        setError("No se pudo cargar la información de la IPS. Redirigiendo a la lista de IPS...");
        console.error(err);
        setTimeout(() => {
          router.push("/admin/ips");
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!ips) return;
    const { name, value } = e.target;
    setIps({ ...ips, [name]: value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/ips/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ips),
      });
      if (!res.ok) throw new Error("Error al guardar los cambios");
      alert("Cambios guardados correctamente");
    } catch (err) {
      alert("Error al guardar los cambios");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar esta IPS?")) return;
    try {
      const res = await fetch(`/api/ips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar la IPS");
      alert("IPS eliminada correctamente");
      router.push("/admin/ips");
    } catch (err) {
      alert("Error al eliminar la IPS");
      console.error(err);
    }
  };

  if (loading)
    return <p className="text-center text-gray-500">Cargando...</p>;
  if (error || !ips)
    return (
      <p className="text-center text-red-600">
        {error}
      </p>
    );

  const inputWrapper = ({
    label,
    icon: Icon,
    children,
  }: {
    label: string;
    icon: React.ElementType;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
        <Icon className="w-5 h-5 text-blue-500" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto mt-12 px-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Editar IPS: {ips.name}
      </h1>
      <form className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        {/* Campos básicos */}
        {inputWrapper({
          label: "Nombre",
          icon: Building2,
          children: (
            <input
              type="text"
              name="name"
              value={ips.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Dirección",
          icon: MapPin,
          children: (
            <input
              type="text"
              name="address"
              value={ips.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Descripción",
          icon: FileText,
          children: (
            <textarea
              name="description"
              value={ips.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none min-h-[120px]"
            />
          ),
        })}

        {inputWrapper({
          label: "Departamento",
          icon: MapPin,
          children: (
            <input
              type="text"
              name="department"
              value={ips.department || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Municipio",
          icon: MapPin,
          children: (
            <input
              type="text"
              name="town"
              value={ips.town || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Teléfono",
          icon: Phone,
          children: (
            <input
              type="text"
              name="phone"
              value={ips.phone || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Email",
          icon: Mail,
          children: (
            <input
              type="email"
              name="email"
              value={ips.email || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Nivel",
          icon: Building2,
          children: (
            <input
              type="text"
              name="level"
              value={ips.level || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "Duración de promoción",
          icon: Timer,
          children: (
            <input
              type="text"
              name="promotion_duration"
              value={ips.promotion_duration || ""}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          ),
        })}

        {inputWrapper({
          label: "URL de la imagen",
          icon: Image,
          children: (
            <>
              <input
                type="text"
                name="image_url"
                value={ips.image_url || ""}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              {ips.image_url && (
                <img
                  src={ips.image_url}
                  alt="Vista previa"
                  className="mt-4 max-h-64 object-contain rounded-xl shadow-lg border dark:border-gray-600"
                />
              )}
            </>
          ),
        })}

        {/* EPS (solo muestra, edición más compleja requeriría otra interfaz) */}
        {ips.eps && ips.eps.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
              <UserCheck className="w-5 h-5 text-blue-500" />
              EPS Aceptadas
            </label>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              {ips.eps.map((eps) => (
                <li key={eps._id}>{eps.name}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">
              (Edición de EPS requiere gestión separada)
            </p>
          </div>
        )}

        {/* Especialidades (solo muestra, edición más compleja requeriría otra interfaz) */}
        {ips.specialties && ips.specialties.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
              <Stethoscope className="w-5 h-5 text-blue-500" />
              Especialidades
            </label>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300">
              {ips.specialties.map((spec) => (
                <li key={spec._id}>{spec.name}</li>
              ))}
            </ul>
            <p className="text-sm text-gray-500">
              (Edición de especialidades requiere gestión separada)
            </p>
          </div>
        )}

        {/* Coordenadas (solo muestra por ahora) */}
        {ips.location && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
              <MapPin className="w-5 h-5 text-blue-500" />
              Coordenadas
            </label>
            <p className="text-gray-700 dark:text-gray-300">
              Latitud: {ips.location.coordinates[1]}, Longitud: {ips.location.coordinates[0]}
            </p>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col md:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl transition-all"
          >
            <Save className="w-5 h-5" />
            Guardar cambios
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition-all"
          >
            <Trash2 className="w-5 h-5" />
            Eliminar IPS
          </button>
        </div>
      </form>
    </div>
  );
};

export default IpsDetailAdmin;