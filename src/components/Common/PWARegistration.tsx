"use client";

import { useEffect } from "react";

export default function PWARegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          // updateViaCache: 'none' ensures the browser never caches sw.js in HTTP cache
          const registration = await navigator.serviceWorker.register("/sw.js", {
            updateViaCache: "none",
          });

          // Check for service worker updates immediately on page load
          registration.update().catch(() => {});

          // When app/tab becomes visible again (e.g. reopening PWA), check for updates
          document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "visible") {
              registration.update().catch(() => {});
            }
          });
        } catch (error) {
          console.error("Rishikul Sangam PWA registration failed:", error);
        }
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  return null;
}
