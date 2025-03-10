"use client";

import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton";

export default function PwaHandler() {
  const [_IS_PWA, _SET_IS_PWA] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed:", err));
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      _SET_IS_PWA(true);
    }
  }, []);

  return !_IS_PWA ? <InstallButton /> : null;
}
