"use client";

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: ApiMeta | null;
};

const getApiBase = () => {
  let base = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
  if (base && !base.includes("/api/v1")) {
    base = base.replace(/\/$/, "") + "/api/v1";
  }
  return base;
};
export const API_BASE = getApiBase();
export const SOCKET_BASE = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8000";

export type TokenScope = "user" | "astrologer" | "admin";
type ValidationErrorItem = {
  loc?: Array<string | number>;
  msg: string;
};

function isReadRequest(options: RequestInit) {
  return !options.method || options.method.toUpperCase() === "GET";
}

function cacheKey(path: string, scope: TokenScope) {
  return `api-cache:${scope}:${path}`;
}

function readCached<T>(path: string, scope: TokenScope): ApiResponse<T> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(cacheKey(path, scope));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiResponse<T>;
  } catch {
    return null;
  }
}

function writeCached<T>(path: string, scope: TokenScope, payload: ApiResponse<T>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(cacheKey(path, scope), JSON.stringify(payload));
}

function reportNetworkError() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("app:network-error"));
  }
}

function reportNetworkRestored() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("app:network-restored"));
  }
}

export function getToken(scope: TokenScope = "user") {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${scope}_access_token`);
}

export function setSession(scope: TokenScope, accessToken: string, refreshToken: string, meta?: { role?: string | null; permissions?: string[] }) {
  localStorage.setItem(`${scope}_access_token`, accessToken);
  localStorage.setItem(`${scope}_refresh_token`, refreshToken);
  if (meta?.role !== undefined) localStorage.setItem(`${scope}_role`, meta.role || "");
  if (meta?.permissions) localStorage.setItem(`${scope}_permissions`, JSON.stringify(meta.permissions));
}

export function clearSession(scope: TokenScope = "user") {
  localStorage.removeItem(`${scope}_access_token`);
  localStorage.removeItem(`${scope}_refresh_token`);
  localStorage.removeItem(`${scope}_role`);
  localStorage.removeItem(`${scope}_permissions`);
}

export function getStoredPermissions(scope: TokenScope = "admin") {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(`${scope}_permissions`) || "[]") as string[];
  } catch {
    return [];
  }
}

export function hasPermission(permission: string, scope: TokenScope = "admin") {
  const permissions = getStoredPermissions(scope);
  return permissions.includes("*") || permissions.includes(permission);
}

function getRefreshToken(scope: TokenScope) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${scope}_refresh_token`);
}

async function refreshToken(scope: TokenScope) {
  const refresh = getRefreshToken(scope);
  if (!refresh) return false;
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refresh }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const payload = (await response.json()) as ApiResponse<{ access_token: string; refresh_token: string }>;
  if (!payload.data?.access_token) return false;
  setSession(scope, payload.data.access_token, payload.data.refresh_token || refresh, {
    role: (payload.data as { role?: string | null }).role,
    permissions: (payload.data as { permissions?: string[] }).permissions || [],
  });
  return true;
}

export async function api<T>(path: string, options: RequestInit = {}, scope: TokenScope = "user", retry = true): Promise<ApiResponse<T>> {
  const readRequest = isReadRequest(options);
  if (typeof window !== "undefined" && !navigator.onLine && !readRequest) {
    reportNetworkError();
    throw new Error("No Internet Connection. Please reconnect before making changes.");
  }
  const token = getToken(scope);
  const hasBody = options.body instanceof FormData;
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        ...(hasBody ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      cache: "no-store",
    });
  } catch {
    reportNetworkError();
    const cached = readRequest ? readCached<T>(path, scope) : null;
    if (cached) return cached;
    throw new Error("No Internet Connection. Showing last synced data.");
  }
  reportNetworkRestored();
  if (response.status === 401) {
    const isOnline = typeof window !== "undefined" && navigator.onLine;
    if (retry && isOnline) {
      const refreshed = await refreshToken(scope);
      if (refreshed) {
        return api<T>(path, options, scope, false);
      }
    }
    // Refresh failed or we are not retrying (e.g. refresh itself returned 401)
    if (isOnline) {
      clearSession(scope);
      const currentPath = window.location.pathname + window.location.search;
      const loginPath =
        scope === "admin"
          ? "/login/admin"
          : scope === "astrologer"
            ? "/login/astrologer"
            : "/login/user";
      if (!window.location.pathname.startsWith("/login")) {
        sessionStorage.setItem("redirect_to", currentPath);
        window.location.href = `${loginPath}?session_expired=true`;
      }
    }
  }
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : { success: response.ok, message: response.statusText, data: null };
  if (!response.ok) {
    let errMsg = payload?.message || "API request failed";
    if (payload?.errors && Array.isArray(payload.errors)) {
      const fieldErrors = (payload.errors as ValidationErrorItem[]).map((err) => {
        const field = err.loc ? err.loc[err.loc.length - 1] : "";
        const formattedField = field ? String(field).charAt(0).toUpperCase() + String(field).slice(1).replace(/_/g, " ") : "";
        return formattedField ? `${formattedField}: ${err.msg}` : err.msg;
      });
      errMsg = `${errMsg} (${fieldErrors.join(", ")})`;
    }
    throw new Error(errMsg);
  }
  if (readRequest) writeCached(path, scope, payload as ApiResponse<T>);
  return payload;
}

export function qs(params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export function formatCurrency(value: number | string | undefined | null) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(value: string | undefined | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
