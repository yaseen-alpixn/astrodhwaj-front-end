"use client";

import { useEffect, useRef, useState } from "react";
import { WifiOff } from "lucide-react";
import { getLiveSessionStatus } from "@/services/liveSession.service";
import type { TokenScope } from "@/services/api";


type BackgroundStreamMonitorProps = {
  scope: TokenScope;
};

/**
 * BackgroundStreamMonitor
 *
 * Renders invisibly inside user/astrologer layouts.
 * Every 8 seconds, if there is a persisted background live stream in window,
 * it checks the session status via the backend API.
 * If the session has ended, it cleanly tears down all Agora tracks and state,
 * and shows a dismissible notification banner.
 */
export default function BackgroundStreamMonitor({ scope }: BackgroundStreamMonitorProps) {
  const [banner, setBanner] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCleaningUp = useRef(false);

  // ─── Clean up a user audience background stream ──────────────────────────
  const cleanupUserStream = (title?: string) => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    try {
      // Leave the Agora channel if client is still alive
      const persisted = (window as any).__activeUserStream;
      if (persisted?.client) {
        try {
          void persisted.client.leave();
        } catch {
          // ignore – client may already be gone
        }
      }
    } finally {
      // Wipe ALL persistence flags regardless of errors
      (window as any).__activeUserStream = null;
      (window as any).__persistUserStream = false;
      (window as any).__activeUserStreamData = null;
      (window as any).__activeUserMessages = null;
      sessionStorage.removeItem("active_live_session");

      setBanner(title ? `The live session "${title}" has ended.` : "The live session you were watching has ended.");
      isCleaningUp.current = false;
    }
  };

  // ─── Clean up an astrologer host background broadcast ─────────────────────
  const cleanupHostBroadcast = (title?: string) => {
    if (isCleaningUp.current) return;
    isCleaningUp.current = true;

    try {
      const persisted = (window as any).__activeLiveBroadcast;
      if (persisted) {
        try {
          if (persisted.audioTrack) {
            persisted.audioTrack.stop();
            persisted.audioTrack.close();
          }
          if (persisted.videoTrack) {
            persisted.videoTrack.stop();
            persisted.videoTrack.close();
          }
          if (persisted.cameraTrack && persisted.cameraTrack !== persisted.videoTrack) {
            persisted.cameraTrack.stop();
            persisted.cameraTrack.close();
          }
          if (persisted.screenTrack) {
            persisted.screenTrack.stop();
            persisted.screenTrack.close();
          }
          if (persisted.client) {
            void persisted.client.leave();
          }
        } catch {
          // ignore teardown errors
        }
      }
    } finally {
      (window as any).__activeLiveBroadcast = null;
      (window as any).__persistBroadcast = false;
      (window as any).__activeLiveBroadcastData = null;
      (window as any).__activeMessages = null;
      (window as any).__activeViewerCount = null;
      sessionStorage.removeItem("active_astrologer_broadcast");

      setBanner(title ? `Your live broadcast "${title}" was ended.` : "Your live broadcast has been terminated.");
      isCleaningUp.current = false;
    }
  };

  // ─── Polling logic ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    const poll = async () => {
      // Skip if already handling a cleanup
      if (isCleaningUp.current) return;

      // Check for user audience background stream
      const userStream = (window as any).__activeUserStream;
      if (userStream?.active?.session?.id) {
        const sessionId: string = userStream.active.session.id;
        const title: string = userStream.active.session.title || "";
        try {
          const response = await getLiveSessionStatus(sessionId, scope);
          const status = response.data?.status;
          if (status && !["live", "active"].includes(status)) {
            cleanupUserStream(title);
          }
        } catch {
          // 404 or other error → session is gone
          cleanupUserStream(title);
        }
        return; // Only check one stream type per tick
      }

      // Check for astrologer host background broadcast
      const broadcast = (window as any).__activeLiveBroadcast;
      if (broadcast?.active?.session?.id) {
        const sessionId: string = broadcast.active.session.id;
        const title: string = broadcast.active.session.title || "";
        try {
          const response = await getLiveSessionStatus(sessionId, scope);
          const status = response.data?.status;
          if (status && !["live", "active"].includes(status)) {
            cleanupHostBroadcast(title);
          }
        } catch {
          cleanupHostBroadcast(title);
        }
      }
    };


    // Start the polling interval (every 8 seconds)
    intervalRef.current = setInterval(() => {
      void poll();
    }, 8000);

    // Also run immediately after mount (catches fast endings right after navigation)
    const initialTimer = setTimeout(() => {
      void poll();
    }, 2000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(initialTimer);
    };
  }, [scope]);

  // ─── Notification Banner UI ───────────────────────────────────────────────
  if (!banner) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-5 right-5 z-[9999] flex items-center gap-3 rounded-xl bg-gray-900 px-4 py-3 text-white shadow-2xl border border-white/10 max-w-[340px] animate-in slide-in-from-right-4 duration-300"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600/20">
        <WifiOff size={15} className="text-red-400" />
      </span>
      <p className="text-xs font-medium leading-snug flex-1">{banner}</p>
      <button
        type="button"
        onClick={() => setBanner(null)}
        className="shrink-0 text-white/40 hover:text-white/80 text-lg leading-none transition-colors"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
