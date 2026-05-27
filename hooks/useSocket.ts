"use client";

import { useEffect, useRef, useState } from "react";

import { createWebSocket } from "@/services/socket.service";
import type { TokenScope } from "@/services/api";

export function useSocket(path: string | null, scope: TokenScope = "user") {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const manualCloseRef = useRef(false);
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!path) return;
    manualCloseRef.current = false;

    const clearReconnectTimer = () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
        reconnectTimerRef.current = null;
      }
    };

    const clearHeartbeatTimer = () => {
      if (heartbeatTimerRef.current) {
        clearInterval(heartbeatTimerRef.current);
        heartbeatTimerRef.current = null;
      }
    };

    const scheduleReconnect = (connect: () => void) => {
      if (manualCloseRef.current || reconnectTimerRef.current) return;
      const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
      reconnectAttemptsRef.current += 1;
      reconnectTimerRef.current = setTimeout(() => {
        reconnectTimerRef.current = null;
        if (!manualCloseRef.current) connect();
      }, delay);
    };

    const connect = () => {
      clearReconnectTimer();
      clearHeartbeatTimer();
      const socket = createWebSocket(path, scope);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setConnected(true);
        if (path.startsWith("/ws/live/")) {
          heartbeatTimerRef.current = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ event: "ping" }));
            }
          }, 25000);
        }
      };

      socket.onclose = () => {
        clearHeartbeatTimer();
        setConnected(false);
        scheduleReconnect(connect);
      };

      socket.onerror = () => {
        socket.close();
      };

      socket.onmessage = (event) => {
        try {
          setLastMessage(JSON.parse(event.data));
        } catch {
          setLastMessage(event.data);
        }
      };
    };

    connect();

    return () => {
      manualCloseRef.current = true;
      clearReconnectTimer();
      clearHeartbeatTimer();
      socketRef.current?.close();
    };
  }, [path, scope]);

  function send(payload: unknown) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
    }
  }

  return { connected, lastMessage, send };
}
