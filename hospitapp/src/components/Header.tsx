"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Home, Info, LogIn, Search, Globe, ChevronDown } from "lucide-react";

export default function Header() {
  const [is_open, set_is_open] = useState(false);
  const [is_mobile, set_is_mobile] = useState(false);
  const [language_index, set_language_index] = useState(0);
  const [is_dropdown_open, set_is_dropdown_open] = useState(false);

  const languages = ["ES", "EN", "FR", "IT", "PT", "DE"];

  useEffect(() => {
    const handle_resize = () => set_is_mobile(window.innerWidth <= 768);
    handle_resize();
    window.addEventListener("resize", handle_resize);
    return () => window.removeEventListener("resize", handle_resize);
  }, []);

  // Load Google Translate API & Maintain Language
  useEffect(() => {
    const load_google_translate = () => {
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(script);
      }

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "es", includedLanguages: "es,en,fr,it,pt,de", autoDisplay: false },
          "google_translate_element"
        );

        // Ocultar elementos de Google Translate
        const style = document.createElement("style");
        style.innerHTML = `
          .goog-te-banner-frame, .goog-te-gadget, .goog-tooltip, .goog-te-menu-frame, .skiptranslate {
            display: none !important;
          }
          body { top: 0px !important; }
        `;
        document.head.appendChild(style);
      };
    };

    load_google_translate();

    // Maintain Language Across Pages
    let saved_language = localStorage.getItem("language") || "ES";
    const saved_index = languages.indexOf(saved_language);
    set_language_index(saved_index !== -1 ? saved_index : 0);

    setTimeout(() => {
      change_language(saved_language.toLowerCase());
    }, 1500);
  }, []);

  const change_language = (lang: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    localStorage.setItem("language", lang.toUpperCase()); // Guardar idioma
  };

  const handle_language_change_mobile = () => {
    const new_index = (language_index + 1) % languages.length;
    set_language_index(new_index);
    const new_language = languages[new_index];

    change_language(new_language.toLowerCase());
  };

  return (
    <>
      {/* TOP NAVBAR (Only for Desktop & Tablet) */}
      {!is_mobile && (
        <header className="bg-[#ECF6FF] py-4 px-6 relative z-50">
          <div className="container mx-auto flex justify-between items-center relative">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold z-50">
              <span className="text-blue-600 notranslate" translate="no">Hospit</span>
              <span className="text-black notranslate" translate="no">APP</span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex md:items-center md:space-x-6">
              <Link href="/" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <Home size={18} /> Inicio
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <Info size={18} /> Sobre Nosotros
              </Link>
              <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4">
                <LogIn size={18} /> Iniciar Sesión
              </Link>

              {/* Language Selector for Desktop */}
              <div className="relative">
                <button
                  onClick={() => set_is_dropdown_open(!is_dropdown_open)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 border border-gray-300 rounded-lg py-1 transition"
                >
                  <Globe size={18} className="text-gray-700" />
                  <span className="notranslate">{languages[language_index]}</span>
                  <ChevronDown size={16} className="text-gray-700" />
                </button>

                {is_dropdown_open && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-24">
                    {languages.map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          set_language_index(index);
                          change_language(lang.toLowerCase());
                          set_is_dropdown_open(false);
                        }}
                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center ${
                          language_index === index ? "font-bold text-blue-600" : ""
                        }`}
                      >
                        <span className="notranslate">{lang}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* BOTTOM NAVBAR (Only for Mobile) */}
      {is_mobile && (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t-lg flex justify-around py-3 border-t border-gray-200 z-50">
          <Link href="/" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <Home size={22} />
            <span className="text-xs">Inicio</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <Info size={22} />
            <span className="text-xs">Nosotros</span>
          </Link>
          <Link href="/login" className="flex flex-col items-center text-gray-700 hover:text-blue-600">
            <LogIn size={22} />
            <span className="text-xs">Ingresar</span>
          </Link>
          {/* Language Selector for Mobile */}
          <button
            onClick={handle_language_change_mobile}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          >
            <Globe size={22} className="text-blue-600" />
            <span className="text-xs font-bold notranslate">{languages[language_index]}</span>
          </button>
        </nav>
      )}

      {/* Google Translate Hidden Element */}
      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}