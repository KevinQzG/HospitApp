"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function ConfirmationPage() {
  const _ROUTER = useRouter();

  useEffect(() => {
    const _TIMEOUT = setTimeout(() => {
      _ROUTER.push("/");
    }, 5000);

    return () => clearTimeout(_TIMEOUT);
  }, [_ROUTER]);

  return (
    <section className="flex min-h-screen justify-center items-center px-6 md:px-12 bg-gradient-to-b from-[#F9FCFF] to-[#E6F0FF]">
      <div className="max-w-md w-full text-center bg-white shadow-xl rounded-2xl p-10">
        <div className="flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-6">
          ¡Cuenta creada exitosamente!
        </h2>
        <p className="text-gray-600 mt-4 text-lg">
          Tu cuenta ha sido creada con éxito. Ahora puedes disfrutar de todos los beneficios de HospitAPP.
        </p>

        <button
          onClick={() => _ROUTER.push("/")}
          className="w-full bg-blue-600 text-white py-3 mt-8 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Ir al inicio
        </button>

        <p className="text-sm text-gray-500 mt-4">
          Serás redirigido automáticamente en 5 segundos...
        </p>
      </div>
    </section>
  );
}