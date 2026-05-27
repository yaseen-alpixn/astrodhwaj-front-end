"use client";

import { io, type Socket } from "socket.io-client";
import { api, qs, SOCKET_BASE, getToken } from "./api";

export type SupportScope = "user" | "astrologer";

export type SupportTicketMessage = {
  id?: string;
  client_id?: string;
  sender_type?: string;
  message: string;
  attachments?: { url: string; name: string }[];
  created_at?: string;
  pending?: boolean;
};

export type SupportTicket = {
  id: string;
  ticket_no?: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at?: string;
  metadata?: { description?: string; user_name?: string; user_email?: string };
  chat_messages?: SupportTicketMessage[];
};

export function listSupportTickets(scope: SupportScope = "user", page = 1) {
  return api<SupportTicket[]>(`/support/tickets${qs({ page, limit: 20 })}`, {}, scope);
}

export function createSupportTicket(
  payload: { subject: string; category: string; priority: string; message: string },
  scope: SupportScope = "user",
) {
  return api<SupportTicket>("/support/tickets", { method: "POST", body: JSON.stringify(payload) }, scope);
}

export function getSupportTicket(ticketId: string, scope: SupportScope = "user") {
  return api<SupportTicket>(`/support/tickets/${ticketId}`, {}, scope);
}

export function replySupportTicket(ticketId: string, message: string, scope: SupportScope = "user") {
  return api<SupportTicketMessage>(`/support/tickets/${ticketId}/reply`, {
    method: "POST",
    body: JSON.stringify({ message, attachments: [] }),
  }, scope);
}

const sockets: Partial<Record<SupportScope, Socket>> = {};

export function getRoleSupportSocket(scope: SupportScope) {
  if (!sockets[scope]) {
    sockets[scope] = io(SOCKET_BASE, {
      path: "/socket.io",
      transports: ["websocket"],
      auth: (cb) => {
        cb({ token: getToken(scope) });
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 800,
      reconnectionDelayMax: 5000,
    });
  }
  return sockets[scope];
}
