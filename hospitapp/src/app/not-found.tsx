import Link from "next/link";
import { Hospital, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#ECF6FF] text-gray-800 p-6">
      {/* Icon */}
      <Hospital className="w-20 h-20 text-blue-600 mb-4" />

      {/* Error Message */}
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-2">Página no encontrada</h2>
      <p className="text-gray-600 mt-2 text-center max-w-md">
        Lo sentimos, no pudimos encontrar la página que buscas. Es posible que
        haya sido eliminada o que la dirección sea incorrecta.
      </p>

      {/* Go Back Button */}
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver al inicio
      </Link>
    </div>
  );
}
