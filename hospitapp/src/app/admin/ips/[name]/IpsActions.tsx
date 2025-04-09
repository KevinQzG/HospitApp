"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

// Server Action para eliminar
import { deleteIps } from "./actions";

type IpsActionsProps = {
  id: string;
  name: string;
};

export default function IpsActions({ id, name }: IpsActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteIps(id);
      router.push("/admin/ips"); // Redirigir después de eliminar
    } catch (error) {
      console.error("Error deleting IPS:", error);
      alert("Error al eliminar la IPS");
    }
  };

  return (
    <div className="flex gap-3 w-full sm:w-auto">
      <button
        onClick={() => router.push(`/admin/ips/edit/${encodeURIComponent(name)}`)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-all duration-300"
      >
        <Pencil className="w-4 h-4" />
        Editar
      </button>
      <button
        onClick={handleDelete}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 text-sm font-medium transition-all duration-300"
      >
        <Trash2 className="w-4 h-4" />
        Eliminar
      </button>
    </div>
  );
}