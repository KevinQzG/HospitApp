"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { House } from "lucide-react";

export default function UserManualPage() {
  const MANUAL_SECTIONS = [
    {
      title: "Introducción",
      content:
        "HospitAPP es una plataforma web progresiva (PWA) diseñada para mejorar el acceso a servicios de salud en Antioquia, Colombia. Permite a los ciudadanos encontrar hospitales y clínicas según su ubicación, EPS, especialidades médicas y reseñas de pacientes.",
    },
    {
      title: "Requisitos del Sistema",
      content:
        "Navegador web actualizado (Google Chrome, Safari, Firefox, Edge).<br>Acceso a internet.<br>Instalación opcional como aplicación web progresiva (PWA) desde el navegador.",
    },
    {
      title: "Acceso a la Plataforma",
      content:
        "Para utilizar HospitAPP, accede desde cualquier navegador a <a href='https://hospitapp.vercel.app' class='text-blue-500 dark:text-blue-400 hover:underline'>https://hospitapp.vercel.app</a>.",
    },
    {
      title: "Registro de Usuario",
      content: getVideoContent("Tutorial de Creación de Cuenta", "8HSc6bIx5EI"),
    },
    {
      title: "Inicio de Sesión",
      content: getVideoContent("Tutorial de Inicio de Sesión", "3V8oZFCTkdI"),
    },
    {
      title: "Cierre de Sesión",
      content: getVideoContent("Tutorial de Cierre de Sesión", "JQJGdeT5QzU"),
    },
    {
      title: "Traducción de la Página",
      content: getVideoContent("Tutorial de Cambio de Idioma", "hQ5wciOiRbE"),
    },
    {
      title: "Búsqueda de IPS",
      content: getVideoContent("Tutorial de Búsqueda de IPS", "TMaveb1ICVM"),
    },
    {
      title: "Ordenar Resultados",
      content: getVideoContent("Tutorial de Filtros", "o-G6KP0nwz8"),
    },
    {
      title: "Detalle de una IPS",
      content: getVideoContent("Tutorial de Detalles de IPS", "QPGzeh_LdPs"),
    },
    {
      title: "Navegación a una IPS",
      content: getVideoContent("Tutorial de Navegación", "f9KvD733GRQ"),
    },
    {
      title: "Reseñas de Usuarios",
      content: getVideoContent("Tutorial de Reseñas", "XOxGGh63HL0"),
    },
    {
      title: "Promocionar una IPS",
      content: getVideoContent("Tutorial de Promoción de IPS", "dCpAryGylcQ"),
    },
    {
      title: "Solicitar Registro de IPS",
      content: getVideoContent("Tutorial de Registro de IPS", "3W9UlXBArwE"),
    },
    {
      title: "Soporte",
      content:
        "Para asistencia técnica o inquietudes sobre el funcionamiento de la plataforma, puedes escribir a <a href='mailto:soporte@hospitapp.app' class='text-blue-500 dark:text-blue-400 hover:underline'>soporte@hospitapp.app</a>.",
    },
  ];

  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackButton(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const href = anchor.getAttribute("href");
        if (href) {
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />

        {showBackButton && (
          <div className="fixed top-6 left-4 md:left-6 z-50">
            <Link
              href="/"
              className="flex items-center gap-2.5 px-4 py-2.5 bg-gray-800/40 backdrop-blur-md text-white rounded-full hover:bg-gray-700/40 transition-all duration-300 group shadow-lg hover:shadow-xl"
              aria-label="Volver a la página de inicio"
            >
              <House className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm font-medium tracking-wide opacity-90 group-hover:opacity-100">
                Inicio
              </span>
            </Link>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Manual de Uso
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Guía completa para utilizar HospitAPP, la plataforma que conecta a
              los ciudadanos con los servicios de salud en Antioquia.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="lg:w-1/4 lg:sticky lg:top-8 lg:self-start">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-700/50">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                <svg
                  className="h-5 w-5 text-blue-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
                Índice
              </h2>
              <nav className="space-y-1" aria-label="Índice de contenidos">
                {MANUAL_SECTIONS.map((section, index) => (
                  <Link
                    key={index}
                    href={`#section-${index}`}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <span className="text-blue-400 font-medium mr-3 text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-gray-300 group-hover:text-white text-sm">
                      {section.title}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          <main className="lg:w-3/4 space-y-12">
            {MANUAL_SECTIONS.map((section, index) => (
              <section
                key={index}
                id={`section-${index}`}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700/50"
              >
                <div className="flex items-center mb-8">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-900/50 mr-4">
                    <span className="text-blue-400 font-semibold text-lg">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white tracking-tight">
                    {section.title}
                  </h3>
                </div>
                <div
                  className="text-gray-300 text-base leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </section>
            ))}
          </main>
        </div>
      </div>

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-24 right-4 md:bottom-8 md:right-6 lg:bottom-12 lg:right-10 bg-blue-600/90 backdrop-blur-sm text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-all duration-200 hover:scale-110 z-50"
        aria-label="Volver al inicio"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}

function getVideoContent(title: string, videoId: string): string {
  return `
    <div class='mt-6 mx-auto w-full max-w-screen-md p-4 bg-gray-800/30 rounded-2xl shadow-lg border border-gray-600/50 group hover:shadow-xl transition-shadow duration-300'>
      <div class='aspect-w-16 aspect-h-9 rounded-xl overflow-hidden'>
        <iframe 
          src='https://www.youtube.com/embed/${videoId}' 
          title='${title}' 
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' 
          allowfullscreen 
          class='w-full h-full transition-opacity duration-500 ease-in-out opacity-90 group-hover:opacity-100'>
        </iframe>
      </div>
    </div>
  `;
}
