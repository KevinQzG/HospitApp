"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoClose, IoDownloadOutline } from "react-icons/io5";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

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
      (installPrompt as any).prompt();
      const choiceResult = await (installPrompt as any).userChoice;
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
    <div className="fixed bottom-6 right-6 animate-fade-in-up">
      <div className="bg-white shadow-xl rounded-2xl p-4 flex items-center space-x-4 w-96 border border-gray-200">
        <div className="flex-shrink-0 text-blue-600 text-4xl">📲</div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">
            Instala HospitAPP
          </h2>
          <p className="text-sm text-gray-500">
            Accede rápidamente a hospitales y clínicas cerca de ti.
          </p>
        </div>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-md"
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
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-all"
          aria-label="Cerrar"
        >
          <IoClose className="text-xl" />
        </button>
      </div>
    </div>
  );
}
