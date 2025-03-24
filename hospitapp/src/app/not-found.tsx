import Link from "next/link";
import { Hospital, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ECF6FF] dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 text-center">
      {/* Icon */}
      <Hospital className="w-20 h-20 text-blue-600 dark:text-blue-400 mb-4" aria-hidden="true" />

      {/* Error Message */}
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white">404</h1>
      <h2 className="text-2xl font-semibold mt-2 text-gray-800 dark:text-gray-200">
        Página no encontrada
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md">
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que
        haya sido eliminada o que la dirección sea incorrecta.
      </p>

      {/* Go Back Button */}
      <Link
        href="/"
        aria-label="Volver al inicio"
        className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>
    </div>
  );
}
