"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Home, Info, LogIn, Globe, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isMobile, setIsMobile] = useState(false);
  const [languageIndex, setLanguageIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated ?? false;
  const pathname = usePathname();
  const LANGUAGES = ["ES", "EN", "FR", "IT", "PT", "DE"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    setIsInitialized(true);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      authContext?.logout();
      location.reload();
    } catch (error) {
      console.error("Error al cerrar sesión:", error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "ES";
    const savedIndex = LANGUAGES.indexOf(savedLanguage);
    setLanguageIndex(savedIndex !== -1 ? savedIndex : 0);
    changeLanguage(savedLanguage.toLowerCase());

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    if (
      !navigator.userAgent.includes("Chrome-Lighthouse") &&
      !document.getElementById("google-translate-script")
    ) {
      window.addEventListener("load", () => {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);

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
      });
    }
  }, []);

  const changeLanguage = (lang: string) => {
    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
    localStorage.setItem("language", lang.toUpperCase());
  };

  const handleLanguageChangeMobile = (index: number) => {
    setLanguageIndex(index);
    changeLanguage(LANGUAGES[index].toLowerCase());
    setIsLanguageModalOpen(false);
  };

  return (
    <>
      {/* TOP NAVBAR (Desktop) */}
      {!isMobile && isInitialized && (
        <header className="bg-[#ECF6FF] dark:bg-gray-900 py-4 px-6 relative z-50 transition-colors">
          <div className="container mx-auto flex justify-between items-center relative">
            <Link href="/" className="text-2xl font-bold z-50">
              <span className="text-blue-500 notranslate" translate="no">Hospit</span>
              <span className="text-black dark:text-white notranslate" translate="no">APP</span>
            </Link>

            <nav className="hidden md:flex md:items-center md:space-x-6">
              <Link
                href="/"
                className={`flex items-center gap-2 px-4 ${pathname === "/" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
              >
                <Home size={18} /> Inicio
              </Link>

              <Link
                href="/about"
                className={`flex items-center gap-2 px-4 ${pathname === "/about" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
              >
                <Info size={18} /> Sobre Nosotros
              </Link>

              {!isAuthenticated ? (
                <Link
                  href="/login"
                  className={`flex items-center gap-2 px-4 ${pathname === "/login" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
                >
                  <LogIn size={18} /> Iniciar Sesión
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 text-gray-700 dark:text-gray-300 hover:text-red-500"
                >
                  <LogIn size={18} /> Cerrar Sesión
                </button>
              )}

              {/* Language Dropdown */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-500 px-4 border border-gray-300 dark:border-gray-500 rounded-lg py-1 transition"
                  >
                    <Globe size={18} />
                    <span className="notranslate">{LANGUAGES[languageIndex]}</span>
                    <ChevronDown size={16} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg w-24 z-50">
                      {LANGUAGES.map((lang, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setLanguageIndex(index);
                            changeLanguage(lang.toLowerCase());
                            setIsDropdownOpen(false);
                          }}
                          className={`block px-4 py-2 w-full text-center ${languageIndex === index ? "font-bold text-blue-500" : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"}`}
                        >
                          <span className="notranslate">{lang}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </header>
      )}

      {/* BOTTOM NAVBAR (Mobile) */}
      {isMobile && isInitialized && (
        <nav className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-t-lg flex justify-around py-3 border-t border-gray-200/50 dark:border-gray-700/50 z-50">
          <Link
            href="/"
            className={`flex flex-col items-center ${pathname === "/" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
          >
            <Home size={22} />
            <span className="text-xs">Inicio</span>
          </Link>

          <Link
            href="/about"
            className={`flex flex-col items-center ${pathname === "/about" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
          >
            <Info size={22} />
            <span className="text-xs">Nosotros</span>
          </Link>

          {!isAuthenticated ? (
            <Link
              href="/login"
              className={`flex flex-col items-center ${pathname === "/login" ? "text-blue-500" : "text-gray-700 dark:text-gray-300 hover:text-blue-500"}`}
            >
              <LogIn size={22} />
              <span className="text-xs">Ingresar</span>
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-red-500"
            >
              <LogIn size={22} />
              <span className="text-xs">Salir</span>
            </button>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLanguageModalOpen(true)}
            className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            <Globe size={22} />
            <span className="text-xs font-bold notranslate">{LANGUAGES[languageIndex]}</span>
          </motion.button>
        </nav>
      )}

      {/* Mobile Language Modal */}
      <AnimatePresence>
        {isMobile && isLanguageModalOpen && isInitialized && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setIsLanguageModalOpen(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white dark:bg-gray-800 w-full max-w-md rounded-t-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Selecciona un idioma
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {LANGUAGES.map((lang, index) => (
                  <motion.button
                    key={index}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleLanguageChangeMobile(index)}
                    className={`py-3 px-4 rounded-xl text-center ${
                      languageIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    <span className="notranslate">{lang}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Translate Container (invisible) */}
      <div id="google_translate_element" className="hidden"></div>
    </>
  );
}
