"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home, Info, Stethoscope, LogIn, Search } from "lucide-react";

export default function Header() {
  const [is_open, set_is_open] = useState(false);

  return (
    <header className="bg-[#ECF6FF] shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-blue-600">Hospit</span>APP
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => set_is_open(!is_open)}
        >
          {is_open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            is_open ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-[#ECF6FF] md:bg-transparent shadow-md md:shadow-none py-4 md:py-0 transition-all`}
        >
          <Link href="/" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">
            <Home size={18} /> Inicio
          </Link>
          <Link href="/about" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">
            <Info size={18} /> Sobre Nosotros
          </Link>
          <Link href="/specialties" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">
            <Stethoscope size={18} /> Especialidades
          </Link>
          <Link href="/login" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">
            <LogIn size={18} /> Iniciar Sesión
          </Link>
        </nav>

        {/* Search Button */}
        <Link href="/search" className="hidden md:flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          <Search size={18} /> Buscar
        </Link>
      </div>
    </header>
  );
}
