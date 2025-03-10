"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, Info, LogIn, Globe, ChevronDown } from "lucide-react";

export default function Header() {
  const [_IS_OPEN, _SET_IS_OPEN] = useState(false);
  const [_IS_MOBILE, _SET_IS_MOBILE] = useState(false);
  const [_LANGUAGE_INDEX, _SET_LANGUAGE_INDEX] = useState(0);
  const [_IS_DROPDOWN_OPEN, _SET_IS_DROPDOWN_OPEN] = useState(false);

  const pathname = usePathname(); // Get current route
  const _LANGUAGES = ["ES", "EN", "FR", "IT", "PT", "DE"];

  useEffect(() => {
    const _HANDLE_RESIZE = () => _SET_IS_MOBILE(window.innerWidth <= 768);
    _HANDLE_RESIZE();
    window.addEventListener("resize", _HANDLE_RESIZE);
    return () => window.removeEventListener("resize", _HANDLE_RESIZE);
  }, []);

  useEffect(() => {
    const _LOAD_GOOGLE_TRANSLATE = () => {
      if (!navigator.userAgent.includes("Chrome-Lighthouse")) {
        setTimeout(() => {
          if (!document.getElementById("google-translate-script")) {
            const _SCRIPT = document.createElement("script");
            _SCRIPT.id = "google-translate-script";
            _SCRIPT.src =
              "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            _SCRIPT.async = true;
            document.body.appendChild(_SCRIPT);
          }

          window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: "es",
                includedLanguages: "es,en,fr,it,pt,de",
                autoDisplay: false,
              },
              "google_translate_element"
            );

            const _STYLE = document.createElement("style");
            _STYLE.innerHTML = `
              .goog-te-banner-frame, .goog-te-gadget, .goog-tooltip, .goog-te-menu-frame, .skiptranslate {
                display: none !important;
              }
              body { top: 0px !important; }
            `;
            document.head.appendChild(_STYLE);
          };
        }, 4000);
      }
    };

    _LOAD_GOOGLE_TRANSLATE();

    let _SAVED_LANGUAGE = localStorage.getItem("language") || "ES";
    const _SAVED_INDEX = _LANGUAGES.indexOf(_SAVED_LANGUAGE);
    _SET_LANGUAGE_INDEX(_SAVED_INDEX !== -1 ? _SAVED_INDEX : 0);

    setTimeout(() => {
      _CHANGE_LANGUAGE(_SAVED_LANGUAGE.toLowerCase());
    }, 2000);
  }, []);

  const _CHANGE_LANGUAGE = (lang: string) => {
    const _SELECT = document.querySelector(
      ".goog-te-combo"
    ) as HTMLSelectElement;
    if (_SELECT) {
      _SELECT.value = lang;
      _SELECT.dispatchEvent(new Event("change"));
    }
    localStorage.setItem("language", lang.toUpperCase());
  };

  const _HANDLE_LANGUAGE_CHANGE_MOBILE = () => {
    const _NEW_INDEX = (_LANGUAGE_INDEX + 1) % _LANGUAGES.length;
    _SET_LANGUAGE_INDEX(_NEW_INDEX);
    const _NEW_LANGUAGE = _LANGUAGES[_NEW_INDEX];
    _CHANGE_LANGUAGE(_NEW_LANGUAGE.toLowerCase());
  };

  return (
    <>
      {/* TOP NAVBAR (Only for Desktop & Tablet) */}
      {!_IS_MOBILE && (
        <header className="bg-[#ECF6FF] py-4 px-6 relative z-50">
          <div className="container mx-auto flex justify-between items-center relative">
            <Link href="/" className="text-2xl font-bold z-50">
              <span className="text-blue-600 notranslate" translate="no">
                Hospit
              </span>
              <span className="text-black notranslate" translate="no">
                APP
              </span>
            </Link>

            <nav className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 ${
                  pathname === "/"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Home size={18} /> Inicio
              </Link>
              <Link
                href="/about"
                className={`flex items-center gap-2 px-4 ${
                  pathname === "/about"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <Info size={18} /> Sobre Nosotros
              </Link>
              <Link
                href="/login"
                className={`flex items-center gap-2 px-4 ${
                  pathname === "/login"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                <LogIn size={18} /> Iniciar Sesión
              </Link>

              <div className="relative">
                <button
                  onClick={() => _SET_IS_DROPDOWN_OPEN(!_IS_DROPDOWN_OPEN)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 border border-gray-300 rounded-lg py-1 transition"
                >
                  <Globe size={18} className="text-gray-700" />
                  <span className="notranslate">
                    {_LANGUAGES[_LANGUAGE_INDEX]}
                  </span>
                  <ChevronDown size={16} className="text-gray-700" />
                </button>

                {_IS_DROPDOWN_OPEN && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-24">
                    {_LANGUAGES.map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          _SET_LANGUAGE_INDEX(index);
                          _CHANGE_LANGUAGE(lang.toLowerCase());
                          _SET_IS_DROPDOWN_OPEN(false);
                        }}
                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center ${
                          _LANGUAGE_INDEX === index
                            ? "font-bold text-blue-600"
                            : ""
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
      {_IS_MOBILE && (
        <nav className="fixed bottom-0 left-0 w-full bg-white shadow-t-lg flex justify-around py-3 border-t border-gray-200 z-50">
          <Link
            href="/"
            className={`flex flex-col items-center ${
              pathname === "/"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <Home size={22} />
            <span className="text-xs">Inicio</span>
          </Link>
          <Link
            href="/about"
            className={`flex flex-col items-center ${
              pathname === "/about"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <Info size={22} />
            <span className="text-xs">Nosotros</span>
          </Link>
          <Link
            href="/login"
            className={`flex flex-col items-center ${
              pathname === "/login"
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            <LogIn size={22} />
            <span className="text-xs">Ingresar</span>
          </Link>
          <button
            onClick={_HANDLE_LANGUAGE_CHANGE_MOBILE}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          >
            <Globe size={22} className="text-blue-600" />
            <span className="text-xs font-bold notranslate">
              {_LANGUAGES[_LANGUAGE_INDEX]}
            </span>
          </button>
        </nav>
      )}

      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}
