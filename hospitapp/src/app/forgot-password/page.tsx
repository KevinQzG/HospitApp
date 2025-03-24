"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailSent(true);
  };

  return (
    <section className="flex min-h-screen">
      {/* Left Side - Branding & Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>

        <h1 className="text-5xl font-bold mb-6 z-10">HospitAPP</h1>
        <p className="text-xl text-center max-w-md z-10">
          Recupera tu cuenta y sigue encontrando la mejor atención médica.
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

      {/* Right Side - Forgot Password Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white">
        <div className="max-w-md w-full">
          <Link href="/login" className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-all">
            <ArrowLeft size={20} className="mr-2" />
            Volver al inicio de sesión
          </Link>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">Recuperar contraseña</h2>
          <p className="text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>

          {/* Success Message */}
          {emailSent ? (
            <div className="mt-8 p-6 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
              <p className="text-lg">
                📩 Hemos enviado un enlace de recuperación a <b>{email}</b>.
              </p>
              <p className="text-sm mt-2">
                Revisa tu bandeja de entrada o la carpeta de spam.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email Field */}
              <div className="relative">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    id="email"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
              >
                Enviar enlace de recuperación
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}