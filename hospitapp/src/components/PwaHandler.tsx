"use client";

import { useEffect, useState } from "react";
import InstallButton from "@/components/InstallButton";

export default function PwaHandler() {
  const [isPwa, setIsPwa] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.error("SW registration failed:", err));
    }

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsPwa(true);
    }
  }, []);

  return !isPwa ? <InstallButton /> : null;
}