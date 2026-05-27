"use client";

import { useEffect, useMemo, useState } from "react";
import RoleAndPermissionHeader from "./RoleAndPermissionHeader";
import RoleCards, { type Role, getRoleRank, getRankLabel } from "./RoleCards";
import PermissionMatrix from "./PermissionMatrix";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminApi } from "../api";
import MemberManagement from "./MemberManagement";

type PermissionResponse = {
  matrix: Record<string, string[]>;
};

const emptyRole: Role = {
  id: "",
  name: "",
  slug: "",
  permissions: [],
  hierarchy_level: 10,
};

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"roles" | "members">("roles");
  const [addMemberTrigger, setAddMemberTrigger] = useState(0);

  const loadData = () => {
    Promise.all([
      adminApi<Role[]>("/admin/roles"),
      adminApi<PermissionResponse>("/admin/permissions"),
    ])
      .then(([roleResponse, permissionResponse]) => {
        setRoles(roleResponse.data || []);
        setPermissions(Object.values(permissionResponse.data.matrix || {}).flat());
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load roles"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const rolePayload = useMemo(() => {
    const rank = getRoleRank(editingRole?.hierarchy_level);
    return {
      name: editingRole?.name || "",
      slug: editingRole?.slug || "",
      permissions: editingRole?.permissions || [],
      status: "active",
      rank: rank,
      hierarchy_level: editingRole?.hierarchy_level || 10,
    };
  }, [editingRole]);

  const saveRole = () => {
    if (!editingRole || !rolePayload.name || !rolePayload.slug) return;
    setSaving(true);
    const isEdit = Boolean(editingRole.id);
    const path = isEdit ? `/admin/roles/${editingRole.id}` : "/admin/roles";
    const method = isEdit ? "PATCH" : "POST";
    adminApi<Role>(path, { method, body: JSON.stringify(rolePayload) })
      .then((response) => {
        setRoles((current) => {
          if (isEdit) return current.map((role) => role.id === editingRole.id ? { ...role, ...rolePayload } : role);
          return [{ ...rolePayload, id: response.data?.id || crypto.randomUUID() }, ...current];
        });
        setEditingRole(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to save role"))
      .finally(() => setSaving(false));
  };

  const deleteRole = () => {
    if (!editingRole?.id) return;
    const roleId = editingRole.id;
    setRoles((current) => current.filter((role) => role.id !== roleId));
    setEditingRole(null);
    adminApi(`/admin/roles/${roleId}`, { method: "DELETE" }).catch((err) => {
      setError(err instanceof Error ? err.message : "Unable to delete role");
      loadData();
    });
  };

  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white py-8 pl-5 pr-2 md:p-6 lg:max-w-[900px] xl:max-w-full">
        {" "}
        <RoleAndPermissionHeader 
          onAdd={() => {
            if (activeTab === "roles") {
              setEditingRole(emptyRole);
            } else {
              setAddMemberTrigger((prev) => prev + 1);
            }
          }} 
        />

        {/* Tab switch buttons */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "roles"
                ? "border-[#4898E1] text-[#4898E1]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab("members")}
            className={`pb-3 px-5 font-bold text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === "members"
                ? "border-[#4898E1] text-[#4898E1]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Sub-Admin Members
          </button>
        </div>

        {activeTab === "roles" ? (
          <div className="space-y-6">
            {loading && <div className="p-6 text-center text-gray-500">Loading...</div>}
            {error && <div className="p-4 text-center text-red-500">{error}</div>}
            {!loading && roles.length === 0 && <div className="p-6 text-center text-gray-500">No roles found</div>}
            <RoleCards roles={roles} onEdit={setEditingRole} />
            <PermissionMatrix roles={roles} onEditRole={setEditingRole} />
          </div>
        ) : (
          <MemberManagement roles={roles} addTrigger={addMemberTrigger} />
        )}
      </div>

      {editingRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-[min(760px,95vw)] rounded-xl bg-white p-6 shadow-sm max-h-[90vh] flex flex-col">
            <h2 className="text-xl font-semibold mb-4">{editingRole.id ? "Edit Role" : "Create Role"}</h2>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-4">
              <input 
                value={editingRole.name} 
                onChange={(event) => {
                  const val = event.target.value;
                  const computedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
                  setEditingRole({ 
                    ...editingRole, 
                    name: val, 
                    slug: editingRole.id ? editingRole.slug : computedSlug
                  });
                }} 
                placeholder="Role Name" 
                className="border rounded-lg p-3 text-sm outline-none focus:border-[#4898E1]" 
              />
              <select 
                value={getRoleRank(editingRole.hierarchy_level)} 
                onChange={(event) => {
                  const rankVal = Number(event.target.value);
                  const rank_hl_mapping: Record<number, number> = {1: 0, 2: 10, 3: 20, 4: 30};
                  setEditingRole({ ...editingRole, hierarchy_level: rank_hl_mapping[rankVal] });
                }} 
                className="border rounded-lg p-3 text-sm outline-none bg-white focus:border-[#4898E1]"
              >
                <option value={1}>Rank 1 — Super Admin</option>
                <option value={2}>Rank 2 — Finance Admin</option>
                <option value={3}>Rank 3 — Support Admin</option>
                <option value={4}>Rank 4 — Content Admin</option>
              </select>
            </div>

            {/* Quick Templates */}
            <div className="mb-4 flex flex-wrap gap-2 items-center bg-gray-50 p-2.5 rounded-lg">
              <span className="text-xs font-semibold text-gray-500 mr-1">Quick Templates:</span>
              <button
                type="button"
                onClick={() => {
                  setEditingRole({
                    ...editingRole,
                    hierarchy_level: 0,
                    permissions: [...permissions],
                  });
                }}
                className="text-xs border hover:border-[#4898E1] px-3 py-1.5 rounded-lg bg-white font-medium text-gray-700 transition-colors"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingRole({
                    ...editingRole,
                    hierarchy_level: 10,
                    permissions: permissions.filter(p => p.startsWith("transactions:") || p.startsWith("wallet:") || p.startsWith("payouts:") || p.startsWith("pricing:") || p === "dashboard:read"),
                  });
                }}
                className="text-xs border hover:border-[#4898E1] px-3 py-1.5 rounded-lg bg-white font-medium text-gray-700 transition-colors"
              >
                Finance Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingRole({
                    ...editingRole,
                    hierarchy_level: 20,
                    permissions: permissions.filter(p => p.startsWith("support:") || p.startsWith("users:") || p.startsWith("notifications:") || p === "dashboard:read"),
                  });
                }}
                className="text-xs border hover:border-[#4898E1] px-3 py-1.5 rounded-lg bg-white font-medium text-gray-700 transition-colors"
              >
                Support Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingRole({
                    ...editingRole,
                    hierarchy_level: 30,
                    permissions: permissions.filter(p => p.startsWith("content:") || p.startsWith("astrologers:") || p.startsWith("live_sessions:") || p === "dashboard:read"),
                  });
                }}
                className="text-xs border hover:border-[#4898E1] px-3 py-1.5 rounded-lg bg-white font-medium text-gray-700 transition-colors"
              >
                Content Admin
              </button>
            </div>

            {/* Permission Checkboxes Grouped by Module */}
            <div className="flex-1 overflow-y-auto rounded-lg border p-4 mb-4">
              {Object.entries(
                permissions.reduce((acc, perm) => {
                  const parts = perm.split(":");
                  const module = parts[0];
                  const action = parts[1] || perm;
                  if (!acc[module]) acc[module] = [];
                  acc[module].push({ permission: perm, action });
                  return acc;
                }, {} as Record<string, { permission: string; action: string }[]>)
              ).map(([module, perms]) => (
                <div key={module} className="border-b pb-3.5 mb-3.5 last:border-none">
                  <h3 className="text-sm font-semibold capitalize mb-2 text-[#4898E1]">{module.replace(/_/g, " ")}</h3>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3">
                    {perms.map(({ permission, action }) => {
                      const isDangerous = ["delete", "refund", "suspend", "approve", "block", "create", "update"].includes(action);
                      return (
                        <label key={permission} className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors select-none ${isDangerous ? "hover:bg-red-50" : "hover:bg-gray-50"}`}>
                          <input
                            type="checkbox"
                            checked={(editingRole.permissions || []).includes(permission)}
                            onChange={(event) => {
                              const current = editingRole.permissions || [];
                              let nextPermissions = event.target.checked
                                ? [...current, permission]
                                : current.filter((item) => item !== permission);
                              
                              if (event.target.checked) {
                                const readPerm = `${module}:read`;
                                if (permissions.includes(readPerm) && !nextPermissions.includes(readPerm)) {
                                  nextPermissions.push(readPerm);
                                }
                              }
                              
                              setEditingRole({
                                ...editingRole,
                                permissions: nextPermissions,
                              });
                            }}
                            className="w-4 h-4 rounded text-[#4898E1] border-gray-300 focus:ring-[#4898E1]"
                          />
                          <span className={isDangerous ? "text-red-600 font-medium" : "text-gray-700"}>
                            {action}
                            {isDangerous && <span className="text-[9px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-semibold ml-1.5 uppercase tracking-wide">Danger</span>}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Preview summary block */}
            <div className="p-3 bg-gray-50 rounded-lg text-xs mb-4">
              <span className="font-semibold text-gray-700 block mb-1">Role Preview (Auto-computed):</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-600 font-medium">
                <div>{editingRole.permissions?.includes("users:read") ? "✔" : "✖"} Can read Users dashboard</div>
                <div>{editingRole.permissions?.includes("payouts:read") ? "✔" : "✖"} Can view astrologer Payouts</div>
                <div>{editingRole.permissions?.includes("transactions:refund") ? "✔" : "✖"} Can issue transaction refunds</div>
                <div>{editingRole.permissions?.includes("astrologers:approve") ? "✔" : "✖"} Can approve onboard astrologers</div>
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-2 border-t">
              <button onClick={() => setEditingRole(null)} className="rounded-md border px-5 py-2 text-sm font-medium">Cancel</button>
              <div className="flex gap-3">
                {editingRole.id && <button onClick={deleteRole} className="rounded-md border px-5 py-2 text-sm font-medium text-red-600">Delete</button>}
                <button onClick={saveRole} disabled={saving} className="rounded-md bg-[#4898E1] px-5 py-2 text-sm font-medium text-white">{saving ? "Saving..." : "Save Role"}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
