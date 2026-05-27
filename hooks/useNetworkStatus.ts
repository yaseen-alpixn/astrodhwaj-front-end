"use client";

import { useEffect, useState } from "react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const sync = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      setReconnecting(!online);
      if (online) {
        window.setTimeout(() => setReconnecting(false), 800);
      }
    };
    const markOffline = () => {
      setIsOnline(false);
      setReconnecting(true);
    };
    const markOnline = () => {
      setIsOnline(true);
      setReconnecting(false);
    };

    sync();
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    window.addEventListener("app:network-error", markOffline);
    window.addEventListener("app:network-restored", markOnline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
      window.removeEventListener("app:network-error", markOffline);
      window.removeEventListener("app:network-restored", markOnline);
    };
  }, []);

  return { isOnline, reconnecting };
}
