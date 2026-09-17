"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("Rishikul Sangam PWA registered:", registration.scope);
          })
          .catch((error) => {
            console.error("Rishikul Sangam PWA registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}
