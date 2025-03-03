"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [is_open, set_is_open] = useState(false);

  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-blue-600">Hospit</span>APP
        </Link>

        {/* Bottom menu */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => set_is_open(!is_open)}
        >
          {is_open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Menu*/}
        <nav
          className={`${
            is_open ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none py-4 md:py-0 transition-all`}
        >
          <Link href="/" className="block md:inline text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">Inicio</Link>
          <Link href="/about" className="block md:inline text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">Sobre Nosotros</Link>
          <Link href="/specialties" className="block md:inline text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">Especialidades</Link>
          <Link href="/login" className="block md:inline text-gray-700 hover:text-blue-600 px-6 md:px-0 py-2 md:py-0">Iniciar Sesión</Link>
        </nav>

        {/* Search*/}
        <Link href="/search" className="hidden md:inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
          Buscar
        </Link>
      </div>
    </header>
  );
}
