"use client";

import { api, type TokenScope } from "./api";

export type AgoraToken = {
  app_id: string;
  token: string;
  channel_name: string;
  uid: number;
  role: "host" | "audience" | "publisher" | "subscriber";
  expires_at: string;
};

export function getLiveToken(sessionId: string, role: AgoraToken["role"] = "audience", scope: TokenScope = "user") {
  return api<AgoraToken>("/agora/live-token", { method: "POST", body: JSON.stringify({ session_id: sessionId, role }) }, scope);
}

export function getCallToken(channelName: string, role: AgoraToken["role"] = "publisher", scope: TokenScope = "user") {
  return api<AgoraToken>("/agora/call-token", { method: "POST", body: JSON.stringify({ channel_name: channelName, role }) }, scope);
}

export async function loadAgoraClient() {
  const mod = await import("agora-rtc-sdk-ng");
  return mod.default;
}
