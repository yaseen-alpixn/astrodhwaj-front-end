"use client";

import { api, qs, type TokenScope } from "./api";
import type { AgoraToken } from "./agora.service";

export type CallSession = {
  id: string;
  booking_id: string;
  call_type?: string;
  mode: string;
  agora_channel?: string;
  status: string;
  started_at?: string;
  ended_at?: string;
  duration_seconds?: number;
  payment_amount?: number;
  charged_amount?: number;
  refund_amount?: number;
  metadata?: Record<string, any>;
};

export function startCall(payload: { booking_id: string; call_type?: "audio_call" | "video_call" }, scope: TokenScope = "user") {
  return api<{ call: CallSession; agora: AgoraToken; participant: string }>("/consultation/start-call", {
    method: "POST",
    body: JSON.stringify(payload),
  }, scope);
}

export function endCall(callId: string, reason?: string, scope: TokenScope = "user") {
  return api<CallSession>("/consultation/end-call", {
    method: "POST",
    body: JSON.stringify({ call_id: callId, reason }),
  }, scope);
}

export function getCallHistory(params: { page?: number; limit?: number } = {}, scope: TokenScope = "user") {
  return api<CallSession[]>(`/consultation/history${qs({ page: params.page || 1, limit: params.limit || 20 })}`, {}, scope);
}
