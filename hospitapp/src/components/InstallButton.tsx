"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [install_prompt, set_install_prompt] = useState<Event | null>(null);

  useEffect(() => {
    const before_install_prompt = (event: Event) => {
      event.preventDefault();
      set_install_prompt(event);
    };

    window.addEventListener("beforeinstallprompt", before_install_prompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", before_install_prompt);
    };
  }, []);

  const handle_install = () => {
    if (install_prompt) {
      (install_prompt as any).prompt();
    }
  };

  return install_prompt ? (
    <button
      onClick={handle_install}
      className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition"
    >
      📲 Instalar HospitApp
    </button>
  ) : null;
}
