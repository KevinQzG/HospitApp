"use client";

import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton";

export default function PwaHandler() {
  const [is_pwa, set_is_pwa] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch((err) => console.error("SW registration failed:", err));
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      set_is_pwa(true);
    }
  }, []);

  return !is_pwa ? <InstallButton /> : null;
}
