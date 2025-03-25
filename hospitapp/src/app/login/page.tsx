"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faApple } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = "/";
      } else {
        alert("Correo electrónico o contraseña incorrectos");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <section className="flex min-h-screen">
      {/* Left Side - Image & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 rounded-full opacity-20" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20" />
        <h1 className="text-5xl font-bold mb-6 z-10 notranslate" translate="no">HospitAPP</h1>
        <p className="text-xl text-center max-w-md z-10">
          La forma más rápida y segura de encontrar atención médica en Colombia.
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

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white dark:bg-gray-900 transition-colors">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Ingresar</h2>
          <p className="text-gray-600 dark:text-gray-300">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="absolute right-4 top-[42px] text-gray-500 hover:text-blue-600 transition-all"
                aria-label="Mostrar u ocultar contraseña"
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Recordarme y olvidé */}
            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-600 dark:text-gray-300">
                <input type="checkbox" className="mr-2 rounded border-gray-300 dark:border-gray-600" />
                Recordarme
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">O ingresa con</p>
            <div className="flex justify-center space-x-4">
              <button
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Ingresar con Google"
              >
                <FontAwesomeIcon icon={faGoogle} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Ingresar con Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
              <button
                className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                aria-label="Ingresar con Apple"
              >
                <FontAwesomeIcon icon={faApple} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
