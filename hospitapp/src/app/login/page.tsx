"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebook, faApple } from '@fortawesome/free-brands-svg-icons';

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <section className="flex min-h-screen">
      {/* Left Side - Branding & Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-700 to-blue-500 text-white flex-col justify-center items-center p-10 relative overflow-hidden">
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20"></div>

        <h1 className="text-5xl font-bold mb-6 z-10">HospitAPP</h1>
        <p className="text-xl text-center max-w-md z-10">
          La forma más rápida y segura de encontrar atención médica en Colombia.
        </p>

        <div className="relative z-10 mt-20 w-full flex justify-center">
          <Image 
            src="/stock/doctores.png" 
            alt="Médicos profesionales" 
            width={800} 
            height={500}
            className="rounded-lg object-cover"
            priority
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-8 md:p-12 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Ingresar</h2>
          <p className="text-gray-600">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">
              Crear cuenta
            </Link>
          </p>

          {/* Login Form */}
          <form className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Contraseña
              </label>
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-10 text-gray-500 hover:text-gray-700 transition"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-between items-center">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2 rounded border-gray-300" />
                Recordarme
              </label>
              <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all"
            >
              Iniciar sesión
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-4">O ingresa con</p>
            <div className="flex justify-center space-x-4">
              <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-all">
                <FontAwesomeIcon icon={faGoogle} className="w-6 h-6 text-gray-700" />
              </button>
              <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-all">
                <FontAwesomeIcon icon={faFacebook} className="w-6 h-6 text-gray-700" />
              </button>
              <button className="border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-all">
                <FontAwesomeIcon icon={faApple} className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}