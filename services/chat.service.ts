"use client";

import { api, qs, type TokenScope } from "./api";

export function getConversations(scope: TokenScope = "user") {
  const prefix = scope === "astrologer" ? "/astrologer/messages" : "/users/messages";
  return api(prefix, {}, scope);
}

export function getMessages(bookingId: string, params: { page?: number; limit?: number } = {}, scope: TokenScope = "user") {
  const prefix = scope === "astrologer" ? "/astrologer/messages" : "/users/messages";
  return api(`${prefix}/${bookingId}${qs({ page: params.page || 1, limit: params.limit || 50 })}`, {}, scope);
}

export function sendMessage(payload: { receiver_id: string; booking_id?: string; message: string; message_type?: string }, scope: TokenScope = "user") {
  const prefix = scope === "astrologer" ? "/astrologer/messages" : "/users/messages";
  return api(prefix, { method: "POST", body: JSON.stringify(payload) }, scope);
}
