"use client";

import { api } from "./api";

export type Conversation = {
  id: string;
  booking_id?: string | null;
  receiver_id?: string;
  name: string;
  preview: string;
  time?: string | null;
  unread_count?: number;
  online?: boolean;
  consultation_mode?: "chat" | "audio_call" | "video_call" | string | null;
};

export type ChatMessage = {
  id: string;
  message: string;
  created_at?: string;
  sender_id: string;
  receiver_id: string;
  is_read?: boolean;
  delivery_status?: "sent" | "delivered" | "read";
  delivered_at?: string | null;
  read_at?: string | null;
  metadata?: Record<string, unknown>;
  pending?: boolean;
};

export function getConversations(scope: "user" | "astrologer" = "user") {
  const path = scope === "astrologer" ? "/astrologer/messages" : "/users/messages";
  return api<Conversation[] | ChatMessage[]>(path, {}, scope);
}

export function getBookingMessages(bookingId: string, scope: "user" | "astrologer" = "user") {
  const path = scope === "astrologer" ? `/astrologer/messages/${bookingId}` : `/users/messages/${bookingId}`;
  return api<ChatMessage[]>(path, {}, scope);
}

export function sendMessage(payload: { receiver_id: string; booking_id?: string | null; message: string }, scope: "user" | "astrologer" = "user") {
  const path = scope === "astrologer" ? "/astrologer/messages" : "/users/messages";
  return api<ChatMessage>(path, { method: "POST", body: JSON.stringify(payload) }, scope);
}
