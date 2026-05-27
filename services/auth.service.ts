"use client";

import { api, setSession } from "./api";

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  role?: string | null;
  permissions?: string[];
  user: {
    account_type: "user" | "astrologer" | "admin" | "staff";
  };
};

export async function login(email: string, password: string) {
  const response = await api<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const scope = response.data.user.account_type === "astrologer" ? "astrologer" : response.data.user.account_type === "admin" || response.data.user.account_type === "staff" ? "admin" : "user";
  setSession(scope, response.data.access_token, response.data.refresh_token, { role: response.data.role, permissions: response.data.permissions || [] });
  return response.data;
}

export async function adminLogin(email: string, password: string) {
  const response = await api<LoginResponse>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }, "admin");
  setSession("admin", response.data.access_token, response.data.refresh_token, { role: response.data.role, permissions: response.data.permissions || [] });
  return response.data;
}

export function signupUser(payload: { full_name: string; email: string; password: string; phone?: string }) {
  return api("/auth/signup/user", { method: "POST", body: JSON.stringify(payload) });
}

export function signupAstrologer(payload: { full_name: string; email: string; password: string; phone?: string }) {
  return api("/auth/signup/astrologer", { method: "POST", body: JSON.stringify(payload) });
}
