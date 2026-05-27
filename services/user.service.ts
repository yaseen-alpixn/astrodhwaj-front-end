"use client";

import { api, qs } from "./api";

export type Astrologer = {
  id: string;
  display_name: string;
  full_name?: string;
  expertise?: string[];
  languages?: string[];
  rating?: number;
  per_minute_rate?: number;
  status?: string;
  availability?: { status?: string };
  avatar_url?: string;
  bio?: string;
  services_allowed?: string[];
};

export type LiveSession = {
  id: string;
  title: string;
  status: string;
  price?: number;
  viewer_count?: number;
  revenue?: number;
  metadata?: {
    astrologer_name?: string;
    duration_minutes?: number;
    specialty?: string;
    image?: string;
  };
};

export type WalletSummary = {
  balance: number;
  recharge_packs: { amount: number; bonus?: number; popular?: boolean }[];
  transactions: {
    id: string;
    transaction_type: string;
    amount: number;
    status: string;
    created_at?: string;
    metadata?: { details?: string };
  }[];
};

export type NotificationItem = {
  id: string;
  type: "offer" | "session" | "feature" | string;
  title: string;
  message: string;
  created_at?: string;
  is_read: boolean;
};

export function getUserHome() {
  return api<{ featured_astrologers: Astrologer[]; live_sessions: LiveSession[] }>("/users/home");
}

export function getAstrologers(params: { page?: number; limit?: number; search?: string } = {}) {
  return api<Astrologer[]>(`/users/astrologers${qs({ page: params.page || 1, limit: params.limit || 10, search: params.search })}`);
}

export function getAstrologerDetail(id: string) {
  return api<Astrologer>(`/users/astrologers/${id}`);
}

export function getWallet() {
  return api<WalletSummary>("/users/wallet");
}

export function rechargeWallet(amount: number) {
  return api("/users/wallet/recharge", { method: "POST", body: JSON.stringify({ amount, gateway: "manual" }) });
}

export function createBooking(payload: { astrologer_id: string; consultation_mode: "chat" | "audio_call" | "video_call"; duration: number }) {
  return api<{ id: string }>("/users/bookings", { method: "POST", body: JSON.stringify(payload) });
}

export function getNotifications() {
  return api<NotificationItem[]>("/users/notifications");
}

export function markNotificationRead(id: string) {
  return api(`/users/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return api("/users/notifications/read-all", { method: "PATCH" });
}

export function deleteUserNotification(id: string) {
  return api(`/users/notifications/${id}`, { method: "DELETE" });
}

export function clearUserNotifications() {
  return api("/users/notifications", { method: "DELETE" });
}

export function getProfile() {
  return api<{
    full_name: string;
    phone?: string;
    avatar_url?: string;
    email: string;
    date_of_birth?: string;
    place_of_birth?: string;
    time_of_birth?: string;
  }>("/users/profile");
}

export function updateProfile(payload: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  date_of_birth?: string;
  place_of_birth?: string;
  time_of_birth?: string;
  password?: string;
}) {
  return api("/users/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("file", file);
  return api<{ url: string }>("/upload/image", {
    method: "POST",
    body: form,
  });
}
