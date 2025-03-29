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
} from "lucide-react";

interface IpsDetailAdminProps {
  id: string;
}

interface IpsData {
  _id: string;
  name: string;
  address: string;
  description: string;
  image_url?: string;
  promotion_duration?: string;
}

const IpsDetailAdmin = ({ id }: IpsDetailAdminProps) => {
  const [ips, setIps] = useState<IpsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/ips/${id}`);
        if (!res.ok) throw new Error("IPS no encontrada");
        const data = await res.json();
        setIps(data);
      } catch {
        setError("No se pudo cargar la información de la IPS.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!res.ok) throw new Error();
      alert("Cambios guardados correctamente");
    } catch {
      alert("Error al guardar los cambios");
    }
  };

  const handleDelete = async () => {
    if (!confirm("¿Seguro que deseas eliminar esta IPS?")) return;
    try {
      const res = await fetch(`/api/ips/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      alert("IPS eliminada correctamente");
      router.push("/admin");
    } catch {
      alert("Error al eliminar la IPS");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (error || !ips) return <p className="text-center text-red-600">{error}</p>;

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
    <form className="space-y-6">
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
  );
};

export default IpsDetailAdmin;
