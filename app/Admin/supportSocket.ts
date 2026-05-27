"use client";

import { io, type Socket } from "socket.io-client";
import { getAdminToken } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
const SOCKET_URL = API_BASE.replace(/\/api\/v1$/, "");

let socket: Socket | null = null;

export function getSupportSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: (cb) => {
        cb({ token: getAdminToken() });
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 5000,
    });
  }
  return socket;
}
