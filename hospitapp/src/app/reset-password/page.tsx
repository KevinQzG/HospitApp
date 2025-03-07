"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [_PASSWORD, _SET_PASSWORD] = useState("");
  const [_CONFIRM_PASSWORD, _SET_CONFIRM_PASSWORD] = useState("");
  const [_PASSWORD_VISIBLE, _SET_PASSWORD_VISIBLE] = useState(false);
  const [_CONFIRM_PASSWORD_VISIBLE, _SET_CONFIRM_PASSWORD_VISIBLE] = useState(false);
  const [_PASSWORD_RESET, _SET_PASSWORD_RESET] = useState(false);

  const _HANDLE_SUBMIT = (e: React.FormEvent) => {
    e.preventDefault();

    if (_PASSWORD === _CONFIRM_PASSWORD) {
      _SET_PASSWORD_RESET(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    } else {
      alert("Las contraseñas no coinciden. Inténtalo de nuevo.");
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Left Side - Branding & Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>

        <h1 className="text-5xl font-bold mb-6 z-10">HospitAPP</h1>
        <p className="text-xl text-center max-w-md z-10">
          Ingresa tu nueva contraseña y sigue disfrutando de nuestros servicios.
        </p>
        <div className="relative z-10 mt-20">
          <Image 
            src="/stock/doctores.png" 
            alt="Médicos profesionales" 
            width={800} 
            height={800} 
            className="rounded-lg shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white">
        <div className="max-w-md w-full">
          <Link href="/login" className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-all">
            <ArrowLeft size={20} className="mr-2" />
            Volver al inicio de sesión
          </Link>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">Restablecer contraseña</h2>
          <p className="text-gray-600">
            Ingresa tu nueva contraseña y confírmala para continuar.
          </p>

          {/* Success Message */}
          {_PASSWORD_RESET ? (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
              <p className="text-lg">✅ ¡Tu contraseña ha sido restablecida con éxito!</p>
              <p className="text-sm mt-2">Serás redirigido al inicio de sesión en unos segundos...</p>
            </div>
          ) : (
            <form onSubmit={_HANDLE_SUBMIT} className="mt-8 space-y-6">
              {/* New Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Nueva contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={_PASSWORD_VISIBLE ? "text" : "password"}
                    placeholder="Ingresa tu nueva contraseña"
                    value={_PASSWORD}
                    onChange={(e) => _SET_PASSWORD(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
                    onClick={() => _SET_PASSWORD_VISIBLE(!_PASSWORD_VISIBLE)}
                  >
                    {_PASSWORD_VISIBLE ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label htmlFor="confirm-password" className="block text-gray-700 font-medium mb-2">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={_CONFIRM_PASSWORD_VISIBLE ? "text" : "password"}
                    placeholder="Confirma tu nueva contraseña"
                    value={_CONFIRM_PASSWORD}
                    onChange={(e) => _SET_CONFIRM_PASSWORD(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition"
                    onClick={() => _SET_CONFIRM_PASSWORD_VISIBLE(!_CONFIRM_PASSWORD_VISIBLE)}
                  >
                    {_CONFIRM_PASSWORD_VISIBLE ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Restablecer contraseña
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}