"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Home, Info, Stethoscope, LogIn, Search } from "lucide-react";

export default function Header() {
  const [is_open, set_is_open] = useState(false);
  const [is_mobile, set_is_mobile] = useState(false);

  // Detect screen size to toggle navbar type
  useEffect(() => {
    const handle_resize = () => set_is_mobile(window.innerWidth <= 768);
    handle_resize();
    window.addEventListener("resize", handle_resize);
    return () => window.removeEventListener("resize", handle_resize);
  }, []);

  return (
    <>
      {/* TOP NAVBAR (Only for Desktop & Tablet) */}
      {!is_mobile && (
        <header className="bg-[#ECF6FF] shadow-md py-4 px-6 relative">
          <div className="container mx-auto flex justify-between items-center relative">
            
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold z-50">
              <span className="text-blue-600">Hospit</span>APP
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <Home size={18} /> Inicio
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <Info size={18} /> Sobre Nosotros
              </Link>
              <Link href="/specialties" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <Stethoscope size={18} /> Especialidades
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <LogIn size={18} /> Iniciar Sesión
              </Link>
            </nav>

            {/* Search Button */}
            <Link href="/search" className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
              <Search size={18} /> Buscar
            </Link>
          </div>
        </header>
      )}

      {/* BOTTOM NAVBAR (Only for Mobile) */}
      {is_mobile && (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t-lg flex justify-around py-3 border-t border-gray-200">
          <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <Home size={22} />
            <span className="text-xs">Inicio</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <Info size={22} />
            <span className="text-xs">Nosotros</span>
          </Link>
          <Link href="/specialties" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <Stethoscope size={22} />
            <span className="text-xs">Especialidades</span>
          </Link>
          <Link href="/login" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <LogIn size={22} />
            <span className="text-xs">Ingresar</span>
          </Link>
        </nav>
      )}
    </>
  );
}