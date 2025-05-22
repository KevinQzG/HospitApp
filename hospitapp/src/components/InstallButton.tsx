"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoClose, IoDownloadOutline } from "react-icons/io5";

// Define the type for BeforeInstallPromptEvent
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    // Verificar si la app ya está instalada
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);

      // Ocultar automáticamente después de 8 segundos
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timeout);
    };

    // Verificar si es un dispositivo móvil
    const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(
      navigator.userAgent
    );
    if (isMobileDevice && !isStandalone) {
      setIsVisible(true);
      // Ocultar automáticamente después de 8 segundos en móviles también
      const timeout = setTimeout(() => {
        setIsVisible(false);
      }, 8000);

      return () => clearTimeout(timeout);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, [pathname]);

  const handleInstall = async () => {
    if (installPrompt) {
      setIsInstalling(true);
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      if (choiceResult.outcome === "accepted") {
        console.log("Usuario aceptó la instalación");
        setIsVisible(false);
      } else {
        console.log("Usuario rechazó la instalación");
      }
      setInstallPrompt(null);
      setIsInstalling(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
      <div className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl p-4 flex items-center space-x-4 w-[calc(100vw-3rem)] sm:w-96">
        <div className="flex-shrink-0 text-blue-600 text-4xl">📲</div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Instala HospitAPP
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Accede rápidamente a hospitales y clínicas cerca de ti.
          </p>
        </div>

        <button
          onClick={handleInstall}
          disabled={isInstalling}
          aria-label="Instalar aplicación"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 whitespace-nowrap
            ${
              isInstalling
                ? "cursor-wait bg-blue-400 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {isInstalling ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Instalando...</span>
            </>
          ) : (
            <>
              <IoDownloadOutline className="text-xl" />
              <span>Instalar</span>
            </>
          )}
        </button>

        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
          aria-label="Cerrar ventana de instalación"
        >
          <IoClose className="text-xl" />
        </button>
      </div>
    </div>
  );
}
