"use client";

import { api, qs } from "./api";

export type AstrologerDashboard = {
  stats: Record<string, number>;
  schedule: {
    id: string;
    metadata?: { user_name?: string };
    booking_time?: string;
    duration?: number;
    status: string;
    consultation_mode: string;
    amount: number;
  }[];
  earning_trend: { month: string; amount: number }[];
  recent_reviews: { id: string; rating: number; comment: string; created_at?: string }[];
};

export type AstrologerWallet = {
  balance: number;
  this_month: number;
  withdrawn: number;
  pending_withdrawals?: number;
  transactions: {
    id: string;
    transaction_type: string;
    amount: number;
    created_at?: string;
    status: string;
  }[];
  withdrawals?: {
    id: string;
    amount: number;
    status: string;
    requested_at?: string;
  }[];
};

export type AstrologerProfile = {
  id?: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  expertise?: string[];
  languages?: string[];
  experience_years?: number;
  rating?: number;
  total_sessions?: number;
  total_earnings?: number;
  per_minute_rate?: number;
  chat_rate?: number;
  video_rate?: number;
  bio?: string;
  availability?: { status?: string };
  bank_details?: Record<string, unknown>;
  user?: {
    full_name?: string;
    email?: string;
    phone?: string;
    avatar_url?: string;
  };
};

export type AstrologerProfileUpdate = Partial<Omit<AstrologerProfile, "user">> & {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  password?: string;
};

export type BankAccount = {
  id: string;
  holder_name: string;
  bank_name?: string | null;
  account_last4?: string | null;
  ifsc_code?: string | null;
  upi_id?: string | null;
  is_primary?: boolean;
};

export type Booking = {
  id: string;
  consultation_mode: string;
  booking_time?: string;
  duration?: number;
  status: string;
  metadata?: {
    user_name?: string;
  };
};

export function getDashboard() {
  return api<AstrologerDashboard>("/astrologer/dashboard", {}, "astrologer");
}

export function getWallet() {
  return api<AstrologerWallet>("/astrologer/wallet", {}, "astrologer");
}

export function getProfile() {
  return api<AstrologerProfile>("/astrologer/profile", {}, "astrologer");
}

export function updateProfile(payload: AstrologerProfileUpdate) {
  return api<AstrologerProfile>("/astrologer/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  }, "astrologer");
}

export function uploadAvatar(file: File) {
  const form = new FormData();
  form.append("file", file);
  return api<{ url: string }>("/upload/image", {
    method: "POST",
    body: form,
  }, "astrologer");
}

export function requestWithdrawal(amount: number, bank_account_id?: string, idempotency_key?: string) {
  return api<{ id: string }>("/astrologer/withdraw", {
    method: "POST",
    body: JSON.stringify({ amount, bank_account_id, idempotency_key }),
  }, "astrologer");
}

export function addBankAccount(payload: {
  holder_name: string;
  bank_name?: string;
  account_number?: string;
  confirm_account_number?: string;
  ifsc_code?: string;
  upi_id?: string;
  is_primary?: boolean;
}) {
  return api<BankAccount>("/astrologer/bank-accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  }, "astrologer");
}

export function getBankAccounts() {
  return api<BankAccount[]>("/astrologer/bank-accounts", {}, "astrologer");
}

export function deleteBankAccount(id: string) {
  return api(`/astrologer/bank-accounts/${id}`, { method: "DELETE" }, "astrologer");
}

export function getBookings(params: { page?: number; limit?: number; status?: string } = {}) {
  const query = qs({ page: params.page || 1, limit: params.limit || 10, status: params.status });
  return api<Booking[]>(`/astrologer/bookings${query}`, {}, "astrologer");
}

export function acceptBooking(bookingId: string) {
  return api<Booking>(`/astrologer/bookings/${bookingId}/accept`, { method: "POST" }, "astrologer");
}

export function declineBooking(bookingId: string) {
  return api<Booking>(`/astrologer/bookings/${bookingId}/decline`, { method: "POST" }, "astrologer");
}

export function endBooking(bookingId: string) {
  return api<Booking>(`/astrologer/bookings/${bookingId}/end`, { method: "POST" }, "astrologer");
}

export function getLiveSessions() {
  return api("/astrologer/live-sessions", {}, "astrologer");
}
