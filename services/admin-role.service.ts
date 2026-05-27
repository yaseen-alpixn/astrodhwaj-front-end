"use client";

import { api } from "./api";

export type AdminRole = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  permissions: string[];
  hierarchy_level?: number;
  status?: string;
};

export type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  role_id?: string;
  role?: AdminRole | null;
  is_active: boolean;
  status: string;
};

export type PermissionMatrix = {
  matrix: Record<string, string[]>;
  permissions: string[];
};

export function getRoles() {
  return api<AdminRole[]>("/admin/roles", {}, "admin");
}

export function createRole(payload: Omit<AdminRole, "id">) {
  return api<AdminRole>("/admin/roles", { method: "POST", body: JSON.stringify(payload) }, "admin");
}

export function updateRole(id: string, payload: Omit<AdminRole, "id">) {
  return api<AdminRole>(`/admin/roles/${id}`, { method: "PUT", body: JSON.stringify(payload) }, "admin");
}

export function deleteRole(id: string) {
  return api(`/admin/roles/${id}`, { method: "DELETE" }, "admin");
}

export function getPermissions() {
  return api<PermissionMatrix>("/admin/permissions", {}, "admin");
}

export function getAdminUsers(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return api<AdminUser[]>(`/admin/admin-users${query}`, {}, "admin");
}

export function createAdminUser(payload: { full_name: string; email: string; password: string; role_id: string }) {
  return api<AdminUser>("/admin/admin-users", { method: "POST", body: JSON.stringify(payload) }, "admin");
}

export function updateAdminUser(id: string, payload: Partial<{ full_name: string; email: string; role_id: string; is_active: boolean; status: string }>) {
  return api<AdminUser>(`/admin/admin-users/${id}`, { method: "PUT", body: JSON.stringify(payload) }, "admin");
}

export function blockAdminUser(id: string) {
  return api(`/admin/admin-users/${id}/block`, { method: "PATCH" }, "admin");
}
