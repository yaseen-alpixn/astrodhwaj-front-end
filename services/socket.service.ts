"use client";

import { getToken, SOCKET_BASE, type TokenScope } from "./api";

export function createWebSocket(path: string, scope: TokenScope = "user") {
  const base = SOCKET_BASE.replace(/^http/, "ws");
  const token = getToken(scope);
  const separator = path.includes("?") ? "&" : "?";
  return new WebSocket(`${base}${path}${token ? `${separator}token=${encodeURIComponent(token)}` : ""}`);
}

export function chatSocket(bookingId: string, scope: TokenScope = "user") {
  return createWebSocket(`/ws/chat/${bookingId}`, scope);
}

export function notificationSocket(userId: string, scope: TokenScope = "user") {
  return createWebSocket(`/ws/notifications/${userId}`, scope);
}

export function liveSessionSocket(sessionId: string, scope: TokenScope = "user") {
  return createWebSocket(`/ws/live/${sessionId}`, scope);
}
