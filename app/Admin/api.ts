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

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
type ValidationErrorItem = {
  loc?: Array<string | number>;
  msg: string;
};

function isReadRequest(options: RequestInit) {
  return !options.method || options.method.toUpperCase() === "GET";
}

function cacheKey(path: string) {
  return `api-cache:admin:${path}`;
}

function readCached<T>(path: string): ApiResponse<T> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(cacheKey(path));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ApiResponse<T>;
  } catch {
    return null;
  }
}

function writeCached<T>(path: string, payload: ApiResponse<T>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(cacheKey(path), JSON.stringify(payload));
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

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_access_token");
}

export function setAdminSession(accessToken: string, refreshToken: string, meta?: { role?: string | null; permissions?: string[] }) {
  localStorage.setItem("admin_access_token", accessToken);
  localStorage.setItem("admin_refresh_token", refreshToken);
  if (meta?.role !== undefined) localStorage.setItem("admin_role", meta.role || "");
  if (meta?.permissions) localStorage.setItem("admin_permissions", JSON.stringify(meta.permissions));
}

export function clearAdminSession() {
  localStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
  localStorage.removeItem("admin_role");
  localStorage.removeItem("admin_permissions");
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_refresh_token");
}

async function refreshAdminToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
    cache: "no-store",
  });
  if (!response.ok) return false;
  const payload = (await response.json()) as ApiResponse<{ access_token: string; refresh_token: string; role?: string | null; permissions?: string[] }>;
  if (!payload.data?.access_token) return false;
  setAdminSession(payload.data.access_token, payload.data.refresh_token || refreshToken, { role: payload.data.role, permissions: payload.data.permissions || [] });
  return true;
}

export async function adminApi<T>(path: string, options: RequestInit = {}, retry = true): Promise<ApiResponse<T>> {
  const readRequest = isReadRequest(options);
  if (typeof window !== "undefined" && !navigator.onLine && !readRequest) {
    reportNetworkError();
    throw new Error("No Internet Connection. Please reconnect before making changes.");
  }
  const token = getAdminToken();
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
    const cached = readRequest ? readCached<T>(path) : null;
    if (cached) return cached;
    throw new Error("No Internet Connection. Showing last synced data.");
  }
  reportNetworkRestored();
  if (response.status === 401 && retry && (await refreshAdminToken())) {
    return adminApi<T>(path, options, false);
  }
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : { success: response.ok, message: response.statusText, data: null };
  if (!response.ok) {
    if (response.status === 401) {
      clearAdminSession();
      if (typeof window !== "undefined") window.location.href = "/login/admin";
    }
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
  if (readRequest) writeCached(path, payload as ApiResponse<T>);
  return payload;
}

export function adminDownload(path: string): Promise<Blob> {
  const token = getAdminToken();
  return fetch(`${API_BASE}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  }).then(async (response) => {
    if (response.status === 401 && (await refreshAdminToken())) return adminDownload(path);
    if (!response.ok) throw new Error("Download failed");
    return response.blob();
  });
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
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export function titleCase(value: string | undefined | null) {
  if (!value) return "-";
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
