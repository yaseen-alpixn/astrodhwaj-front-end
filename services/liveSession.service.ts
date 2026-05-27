"use client";

import { api, qs, type TokenScope } from "./api";

export type LiveSession = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  thumbnail?: string | null;
  session_type?: string;
  price?: number;
  channel_name?: string;
  status: string;
  viewer_count?: number;
  viewers_count?: number;
  revenue?: number;
  started_at?: string | null;
  ended_at?: string | null;
  scheduled_at?: string | null;
  metadata?: Record<string, string | number | null | undefined>;
};

export type AgoraJoin = {
  app_id: string;
  token: string;
  channel_name: string;
  uid: number;
  role: "host" | "audience" | "publisher" | "subscriber";
  expires_at: string;
};

export function getUserLiveSessions(params: { page?: number; limit?: number } = {}) {
  return api<LiveSession[]>(`/user/live-sessions${qs({ page: params.page || 1, limit: params.limit || 20 })}`, {}, "user");
}

export function getLiveSessionStatus(sessionId: string, scope: TokenScope = "user") {
  return api<LiveSession>(`/user/live-sessions/${sessionId}`, {}, scope);
}


export function joinLiveSession(sessionId: string, scope: TokenScope = "user") {
  return api<{ session: LiveSession; agora: AgoraJoin }>(`/user/live-sessions/${sessionId}/join`, { method: "POST" }, scope);
}

export function getAstrologerLiveSessions() {
  return api<LiveSession[]>("/astrologer/live-sessions", {}, "astrologer");
}

export function createLiveSession(payload: Partial<LiveSession> & { title: string }) {
  return api<LiveSession>("/astrologer/live-sessions", { method: "POST", body: JSON.stringify(payload) }, "astrologer");
}

export function startLiveSession(sessionId: string) {
  return api<{ session: LiveSession; agora: AgoraJoin }>(`/astrologer/live-sessions/${sessionId}/start`, { method: "POST" }, "astrologer");
}

export function endLiveSession(sessionId: string, reason?: string) {
  return api<LiveSession>(`/astrologer/live-sessions/${sessionId}/end`, { method: "POST", body: JSON.stringify({ reason }) }, "astrologer");
}

export function resetSessionLock() {
  return api<{ released: boolean }>("/astrologer/session-lock/reset", { method: "POST" }, "astrologer");
}

export function deleteLiveSession(sessionId: string) {
  return api<LiveSession>(`/astrologer/live-sessions/${sessionId}`, { method: "DELETE" }, "astrologer");
}

