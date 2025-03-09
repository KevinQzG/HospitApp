"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

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
    <div className="fixed bottom-6 right-6">
      <div className="bg-white rounded-xl shadow-2xl p-4 flex items-center space-x-4 animate-fade-in-up relative w-80">
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-all text-lg"
          aria-label="Cerrar"
        >
          ✖
        </button>
        <div className="flex-shrink-0">
          <span className="text-3xl">📲</span>
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800">¿Quieres tener HospitAPP?</p>
          <p className="text-xs text-gray-500">Instala la app para una experiencia más rápida.</p>
        </div>
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
        >
          {isInstalling ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Instalando...</span>
            </div>
          ) : (
            <>
              <span>Instalar</span>
              <span className="text-lg">⬇️</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
