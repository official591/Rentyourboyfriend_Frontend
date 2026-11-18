"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register after page load so it never competes with initial critical rendering
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("🚀 Companion Service Worker registered successfully:", registration.scope);
          })
          .catch((err) => {
            console.debug("Service Worker registration skipped or failed:", err);
          });
      });
    }
  }, []);

  return null;
}

