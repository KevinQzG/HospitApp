"use client";

import { useState } from "react";
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteIps(id);
      setSuccessMessage("IPS eliminada con éxito");
      setTimeout(() => {
        router.push("/admin/ips");
      }, 2000);
    } catch {
      setError("Error al eliminar la IPS");
    }
  };

  return (
    <div className="relative">
      {/* Success or Error Notification */}
      {successMessage && (
        <div className="absolute top-0 right-0 mt-2 p-4 bg-green-900 text-green-200 rounded-xl text-sm">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="absolute top-0 right-0 mt-2 p-4 bg-red-900 text-red-200 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={() => router.push(`/admin/ips/edit/${encodeURIComponent(name)}`)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-500 text-sm font-medium transition-all duration-300"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white hover:bg-red-500 text-sm font-medium transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
          Eliminar
        </button>
      </div>

      {/* Overlay for Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              ¿Estás seguro de eliminar esta IPS?
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Esta acción no se puede deshacer. ¿Deseas continuar?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-600 rounded-full hover:bg-gray-500 transition-all duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-all duration-200"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}