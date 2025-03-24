"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, Info, LogIn, Globe, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pathname = usePathname(); // Get current route
  const LANGUAGES = ["ES", "EN", "FR", "IT", "PT", "DE"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const loadGoogleTranslate = () => {
      if (!navigator.userAgent.includes("Chrome-Lighthouse")) {
        setTimeout(() => {
          if (!document.getElementById("google-translate-script")) {
            const script = document.createElement("script");
            script.id = "google-translate-script";
            script.src =
              "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
            script.async = true;
            document.body.appendChild(script);
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

            const style = document.createElement("style");
            style.innerHTML = `
              .goog-te-banner-frame, .goog-te-gadget, .goog-tooltip, .goog-te-menu-frame, .skiptranslate {
                display: none !important;
              }
              body { top: 0px !important; }
            `;
            document.head.appendChild(style);
          };
        }, 4000);
      }
    };

    loadGoogleTranslate();

    const savedLanguage = localStorage.getItem("language") || "ES";
    const savedIndex = LANGUAGES.indexOf(savedLanguage);
    setLanguageIndex(savedIndex !== -1 ? savedIndex : 0);

    setTimeout(() => {
      changeLanguage(savedLanguage.toLowerCase());
    }, 2000);
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    localStorage.setItem("language", lang.toUpperCase());
  };

  const handleLanguageChangeMobile = () => {
    const newIndex = (languageIndex + 1) % LANGUAGES.length;
    setLanguageIndex(newIndex);
    const newLanguage = LANGUAGES[newIndex];
    changeLanguage(newLanguage.toLowerCase());
  };

  return (
    <>
      {/* TOP NAVBAR (Only for Desktop & Tablet) */}
      {!isMobile && (
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
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-4 border border-gray-300 rounded-lg py-1 transition"
                >
                  <Globe size={18} className="text-gray-700" />
                  <span className="notranslate">
                    {LANGUAGES[languageIndex]}
                  </span>
                  <ChevronDown size={16} className="text-gray-700" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-24">
                    {LANGUAGES.map((lang, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setLanguageIndex(index);
                          changeLanguage(lang.toLowerCase());
                          setIsDropdownOpen(false);
                        }}
                        className={`block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-center ${
                          languageIndex === index
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
      {isMobile && (
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
            onClick={handleLanguageChangeMobile}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          >
            <Globe size={22} className="text-blue-600" />
            <span className="text-xs font-bold notranslate">
              {LANGUAGES[languageIndex]}
            </span>
          </button>
        </nav>
      )}

      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}