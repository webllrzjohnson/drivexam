"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function PwaManager() {
  const [isOffline, setIsOffline] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const updateRequested = useRef(false);
  const refreshing = useRef(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let active = true;

    const watchInstallingWorker = (worker: ServiceWorker) => {
      worker.addEventListener("statechange", () => {
        if (active && worker.state === "installed" && navigator.serviceWorker.controller) {
          setWaitingWorker(worker);
        }
      });
    };

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        if (!active) return;

        if (registration.waiting && navigator.serviceWorker.controller) {
          setWaitingWorker(registration.waiting);
        }

        registration.addEventListener("updatefound", () => {
          if (registration.installing) watchInstallingWorker(registration.installing);
        });
      } catch (error) {
        console.warn("Service worker registration failed.", error);
      }
    };

    const handleControllerChange = () => {
      if (!updateRequested.current) return;
      if (refreshing.current) return;
      refreshing.current = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);
    if (document.readyState === "complete") void register();
    else window.addEventListener("load", register, { once: true });

    return () => {
      active = false;
      window.removeEventListener("load", register);
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  const applyUpdate = useCallback(() => {
    updateRequested.current = true;
    waitingWorker?.postMessage({ type: "SKIP_WAITING" });
  }, [waitingWorker]);

  if (!isOffline && !waitingWorker) return null;

  return (
    <div
      aria-live="polite"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-xl items-center justify-between gap-4 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-lg"
      role="status"
    >
      <p className="font-medium">
        {waitingWorker ? "Update available. Refresh to use the latest version." : "You’re offline. Some features need a connection."}
      </p>
      {waitingWorker ? (
        <button className="shrink-0 rounded-lg bg-green-800 px-3 py-2 font-semibold text-white hover:bg-green-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2" onClick={applyUpdate} type="button">
          Refresh
        </button>
      ) : null}
    </div>
  );
}