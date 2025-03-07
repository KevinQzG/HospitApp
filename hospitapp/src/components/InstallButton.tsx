"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [_INSTALL_PROMPT, _SET_INSTALL_PROMPT] = useState<Event | null>(null);

  useEffect(() => {
    const _BEFORE_INSTALL_PROMPT = (event: Event) => {
      event.preventDefault();
      _SET_INSTALL_PROMPT(event);
    };

    window.addEventListener("beforeinstallprompt", _BEFORE_INSTALL_PROMPT);

    return () => {
      window.removeEventListener("beforeinstallprompt", _BEFORE_INSTALL_PROMPT);
    };
  }, []);

  const _HANDLE_INSTALL = () => {
    if (_INSTALL_PROMPT) {
      (_INSTALL_PROMPT as any).prompt();
    }
  };

  return _INSTALL_PROMPT ? (
    <button
      onClick={_HANDLE_INSTALL}
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
    >
      📲 Instalar HospitApp
    </button>
  ) : null;
}