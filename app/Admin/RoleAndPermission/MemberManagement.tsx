"use client";

import { useEffect, useState, useMemo } from "react";
import { 
  Search, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  KeyRound, 
  UserPlus, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  AlertCircle, 
  CheckCircle,
  Copy,
  UserX,
  ShieldAlert,
  Loader2,
  Calendar,
  Monitor
} from "lucide-react";
import { adminApi, qs, titleCase } from "../api";
import type { Role } from "./RoleCards";

export type Member = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  role_id: string;
  is_active: boolean;
  status: "active" | "inactive" | "blocked" | "suspended" | "deleted" | "pending_reset";
  last_login_at?: string;
  last_active_at?: string;
  last_login_ip?: string;
  role?: {
    id: string;
    name: string;
    slug: string;
    permissions: string[];
    hierarchy_level: number;
    rank: number;
  } | null;
};

export type MemberFormState = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role_id: string;
  password?: string;
  confirm_password?: string;
  is_active: boolean;
  status: "active" | "inactive" | "blocked" | "suspended" | "deleted" | "pending_reset";
};

const emptyMember: MemberFormState = {
  id: "",
  full_name: "",
  email: "",
  phone: "",
  role_id: "",
  password: "",
  confirm_password: "",
  is_active: true,
  status: "active",
};

interface MemberManagementProps {
  roles: Role[];
  addTrigger: number;
}

export default function MemberManagement({ roles, addTrigger }: MemberManagementProps) {
  // Lists & metadata
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Pagination & Filtering
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRank, setFilterRank] = useState("");

  // Modals & Temp states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<MemberFormState>(emptyMember);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState<Member | null>(null);
  const [isBlockConfirmOpen, setIsBlockConfirmOpen] = useState<{ member: Member; block: boolean } | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState<Member | null>(null);
  
  // Force Reset success state
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [resetDoneMember, setResetDoneMember] = useState<Member | null>(null);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Password rules helper state
  const [passRules, setPassRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  });

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch admin members
  const fetchMembers = () => {
    setLoading(true);
    const queryParams = qs({
      page,
      limit,
      search: search || undefined,
      role_id: filterRole || undefined,
      status: filterStatus || undefined,
      rank: filterRank ? Number(filterRank) : undefined,
    });

    adminApi<{ data: Member[] }>(`/admin/admin-users${queryParams}`)
      .then((res) => {
        // Correct API structure: res.data contains the list of members
        const items = (res.data as any) || [];
        setMembers(items);
        if (res.meta) {
          setTotalPages(res.meta.total_pages || 1);
          setTotalItems(res.meta.total || items.length);
        } else {
          setTotalPages(1);
          setTotalItems(items.length);
        }
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load members");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Refresh list when filter/page changes
  useEffect(() => {
    fetchMembers();
  }, [page, limit, filterRole, filterStatus, filterRank]);

  // Handle search with simple debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchMembers();
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  // Listen to outer header ADD button click
  useEffect(() => {
    if (addTrigger > 0) {
      setEditingMember({
        id: "",
        full_name: "",
        email: "",
        phone: "",
        role_id: roles[0]?.id || "",
        password: "",
        confirm_password: "",
        is_active: true,
        status: "active",
      });
      setIsModalOpen(true);
    }
  }, [addTrigger]);

  // Evaluate Password Rules real-time
  const checkPasswordStrength = (pass: string) => {
    setPassRules({
      length: pass.length >= 8 && pass.length <= 128,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[^A-Za-z0-9]/.test(pass)
    });
  };

  // Validation
  const validateForm = () => {
    if (!editingMember.full_name.trim()) {
      showToast("Full Name is required", "error");
      return false;
    }
    const emailLower = editingMember.email.trim().toLowerCase();
    if (!emailLower.endsWith("@astrodhwaj.com")) {
      showToast("Admin emails must end with @astrodhwaj.com", "error");
      return false;
    }
    if (!editingMember.role_id) {
      showToast("Please assign a role", "error");
      return false;
    }

    if (!editingMember.id) {
      // Creation rules
      const { length, upper, lower, number, special } = passRules;
      if (!length || !upper || !lower || !number || !special) {
        showToast("Password does not meet complexity requirements", "error");
        return false;
      }
      if (editingMember.password !== editingMember.confirm_password) {
        showToast("Passwords do not match", "error");
        return false;
      }
    }

    if (editingMember.phone) {
      const phoneRegex = /^\+?[0-9][0-9\s-]{7,18}$/;
      if (!phoneRegex.test(editingMember.phone)) {
        showToast("Invalid phone number format", "error");
        return false;
      }
    }

    return true;
  };

  const handleSaveMember = () => {
    if (!validateForm()) return;
    setSaving(true);

    const isEdit = Boolean(editingMember.id);
    const path = isEdit ? `/admin/admin-users/${editingMember.id}` : "/admin/admin-users";
    const method = isEdit ? "PUT" : "POST";

    // Prepare payload
    const payload: any = {
      full_name: editingMember.full_name.trim(),
      email: editingMember.email.trim(),
      role_id: editingMember.role_id,
      phone: editingMember.phone?.trim() || null,
      is_active: editingMember.is_active,
    };

    if (!isEdit) {
      payload.password = editingMember.password;
      payload.confirm_password = editingMember.confirm_password;
      payload.status = editingMember.is_active ? "active" : "inactive";
    } else {
      payload.status = editingMember.is_active ? "active" : "inactive";
    }

    adminApi(path, {
      method,
      body: JSON.stringify(payload)
    })
      .then(() => {
        showToast(isEdit ? "Member updated successfully!" : "Member created successfully!");
        setIsModalOpen(false);
        fetchMembers();
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Error saving member", "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleDeleteMember = () => {
    if (!isDeleteConfirmOpen) return;
    setSaving(true);
    adminApi(`/admin/admin-users/${isDeleteConfirmOpen.id}`, { method: "DELETE" })
      .then(() => {
        showToast("Member successfully deleted!");
        setIsDeleteConfirmOpen(null);
        fetchMembers();
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to delete member", "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleBlockUnblock = () => {
    if (!isBlockConfirmOpen) return;
    const { member, block } = isBlockConfirmOpen;
    setSaving(true);
    const path = `/admin/admin-users/${member.id}/${block ? "block" : "unblock"}`;
    adminApi(path, { method: "PATCH" })
      .then(() => {
        showToast(`Member successfully ${block ? "blocked" : "unblocked"}!`);
        setIsBlockConfirmOpen(null);
        fetchMembers();
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Action failed", "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  const handleForceResetPassword = () => {
    if (!isResetConfirmOpen) return;
    setSaving(true);
    adminApi<{ id: string; temp_password: string }>(
      `/admin/admin-users/${isResetConfirmOpen.id}/force-reset-password`,
      { method: "POST" }
    )
      .then((res) => {
        // Set password states to display to super admin
        setTempPassword(res.data.temp_password);
        setResetDoneMember(isResetConfirmOpen);
        setIsResetConfirmOpen(null);
        showToast("Password reset forced successfully!");
        fetchMembers();
      })
      .catch((err) => {
        showToast(err instanceof Error ? err.message : "Failed to force reset password", "error");
      })
      .finally(() => {
        setSaving(false);
      });
  };

  // Helpers for labels
  const getRankBadgeStyle = (rank?: number) => {
    switch (rank) {
      case 1:
        return "bg-rose-50 border-rose-200 text-rose-700";
      case 2:
        return "bg-amber-50 border-amber-200 text-amber-700";
      case 3:
        return "bg-sky-50 border-sky-200 text-sky-700";
      case 4:
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getRankName = (rank?: number) => {
    switch (rank) {
      case 1: return "Super Admin";
      case 2: return "Finance Admin";
      case 3: return "Support Admin";
      case 4: return "Content Admin";
      default: return "Staff Admin";
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "inactive":
        return "bg-gray-100 text-gray-600 border-gray-200";
      case "blocked":
        return "bg-red-50 text-red-700 border-red-100 animate-pulse";
      case "suspended":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "pending_reset":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Password copied to clipboard!");
  };

  const activeRolesOnly = useMemo(() => {
    return roles.filter(role => role.status !== "inactive");
  }, [roles]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#4898E1] focus:ring-1 focus:ring-[#4898E1]/20 transition-all font-medium"
          />
        </div>

        {/* Filter Role */}
        <select
          value={filterRole}
          onChange={(e) => { setFilterRole(e.target.value); setPage(1); }}
          className="h-10 px-3 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#4898E1] transition-all font-medium text-gray-700"
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>

        {/* Filter Rank */}
        <select
          value={filterRank}
          onChange={(e) => { setFilterRank(e.target.value); setPage(1); }}
          className="h-10 px-3 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#4898E1] transition-all font-medium text-gray-700"
        >
          <option value="">All Ranks</option>
          <option value="1">Rank 1 — Super Admin</option>
          <option value="2">Rank 2 — Finance Admin</option>
          <option value="3">Rank 3 — Support Admin</option>
          <option value="4">Rank 4 — Content Admin</option>
        </select>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="h-10 px-3 text-xs bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-[#4898E1] transition-all font-medium text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blocked">Blocked</option>
          <option value="suspended">Suspended</option>
          <option value="pending_reset">Pending Reset</option>
        </select>
      </div>

      {/* Main Members Table container */}
      <div className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-sm">
        {loading ? (
          /* Loading Skeletal State */
          <div className="p-8 space-y-4">
            <div className="flex items-center space-x-3">
              <Loader2 className="animate-spin text-[#4898E1]" size={22} />
              <span className="text-sm font-semibold text-gray-600">Fetching sub-admin details...</span>
            </div>
            <div className="h-6 bg-gray-100 rounded w-1/3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-12 bg-gray-50 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-50 rounded animate-pulse"></div>
              <div className="h-12 bg-gray-50 rounded animate-pulse"></div>
            </div>
          </div>
        ) : error ? (
          /* Error State */
          <div className="p-8 text-center max-w-md mx-auto">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Failed to load Sub-Admins</h3>
            <p className="text-xs text-gray-500 mb-4">{error}</p>
            <button
              onClick={fetchMembers}
              className="text-xs font-semibold px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : members.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center">
            <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserX size={24} />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">No Members Found</h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto">
              No sub-admin accounts matched your search terms or filters.
            </p>
          </div>
        ) : (
          /* Table Layout */
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 font-semibold text-gray-600 uppercase tracking-wider text-[10px]">
                  <th className="py-4 px-5">Name & Email</th>
                  <th className="py-4 px-4">Role & Rank</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Last Activity</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-all group">
                    {/* Name & Email */}
                    <td className="py-3.5 px-5">
                      <div>
                        <span className="font-semibold text-gray-800 text-sm block group-hover:text-[#4898E1] transition-colors">
                          {member.full_name}
                        </span>
                        <span className="text-gray-500 font-medium text-xs block mt-0.5 select-all">
                          {member.email}
                        </span>
                        {member.phone && (
                          <span className="text-[11px] text-gray-400 block mt-0.5">
                            {member.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Role & Rank */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="font-semibold text-gray-700 bg-gray-100/70 border border-gray-200/50 px-2 py-0.5 rounded text-[11px]">
                          {member.role?.name || titleCase(member.role?.slug || "staff")}
                        </span>
                        <span className={`text-[10px] font-semibold border px-2 py-0.5 rounded-full ${getRankBadgeStyle(member.role?.rank)}`}>
                          {getRankName(member.role?.rank)}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${getStatusBadgeStyle(member.status)}`}>
                        {member.status.toUpperCase().replace("_", " ")}
                      </span>
                    </td>

                    {/* Last Activity */}
                    <td className="py-3.5 px-4">
                      {member.last_active_at ? (
                        <div className="flex flex-col gap-0.5 text-[11px] text-gray-600">
                          <span className="font-medium flex items-center gap-1">
                            <Calendar size={12} className="text-gray-400" />
                            {new Date(member.last_active_at).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {member.last_login_ip && (
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Monitor size={10} />
                              {member.last_login_ip}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Never active</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        {/* Edit button */}
                        <button
                          onClick={() => {
                            setEditingMember({
                              id: member.id,
                              full_name: member.full_name,
                              email: member.email,
                              phone: member.phone || "",
                              role_id: member.role_id,
                              password: "",
                              confirm_password: "",
                              is_active: member.is_active,
                              status: member.status,
                            });
                            // Reset password rules checks
                            setPassRules({ length: false, upper: false, lower: false, number: false, special: false });
                            setIsModalOpen(true);
                          }}
                          className="p-2 border hover:border-gray-300 hover:bg-white rounded-lg text-gray-600 hover:text-[#4898E1] transition-all"
                          title="Edit Sub-Admin"
                        >
                          <Edit size={14} />
                        </button>

                        {/* Force Password Reset (Only Super Admins should trigger this, though backend enforces it) */}
                        <button
                          onClick={() => setIsResetConfirmOpen(member)}
                          className="p-2 border hover:border-gray-300 hover:bg-white rounded-lg text-gray-600 hover:text-purple-600 transition-all"
                          title="Force Password Reset"
                        >
                          <KeyRound size={14} />
                        </button>

                        {/* Block/Unblock toggle */}
                        {member.status === "blocked" ? (
                          <button
                            onClick={() => setIsBlockConfirmOpen({ member, block: false })}
                            className="p-2 border border-emerald-100 hover:border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-all"
                            title="Unblock User"
                          >
                            <Unlock size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsBlockConfirmOpen({ member, block: true })}
                            className="p-2 border border-red-50 hover:border-red-200 bg-red-50/30 hover:bg-red-50 rounded-lg text-red-500 transition-all"
                            title="Block User"
                          >
                            <Lock size={14} />
                          </button>
                        )}

                        {/* Delete (Soft Delete) */}
                        <button
                          onClick={() => setIsDeleteConfirmOpen(member)}
                          className="p-2 border border-red-50 hover:border-red-200 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all"
                          title="Soft Delete Member"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Paginated Footer */}
        {!loading && members.length > 0 && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 font-medium">
            <span>
              Showing {(page - 1) * limit + 1} - {Math.min(page * limit, totalItems)} of {totalItems} members
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page:</span>
                <select
                  value={limit}
                  onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                  className="bg-white border rounded px-1.5 py-1 focus:outline-none focus:border-[#4898E1]"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="p-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-2">Page {page} of {totalPages}</span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="p-1 border rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MEMBER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px] animate-fade-in">
          <div className="w-[min(540px,95vw)] rounded-xl bg-white p-6 shadow-xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden transform scale-100 transition-all">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b mb-4">
              <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                <UserPlus className="text-[#4898E1]" size={18} />
                {editingMember.id ? "Edit Sub-Admin Member" : "Create Sub-Admin Account"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs text-gray-700">
              {/* Full Name */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={editingMember.full_name}
                  onChange={(e) => setEditingMember({ ...editingMember, full_name: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg px-3.5 outline-none focus:border-[#4898E1] transition-all font-medium text-xs text-gray-800"
                />
              </div>

              {/* Email (strict validation warning) */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">
                  Email Address * <span className="text-[10px] text-gray-400 font-normal">(must end with @astrodhwaj.com)</span>
                </label>
                <input
                  type="email"
                  placeholder="example@astrodhwaj.com"
                  disabled={Boolean(editingMember.id)} // Email usually immutable
                  value={editingMember.email}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg px-3.5 outline-none focus:border-[#4898E1] disabled:bg-gray-50 disabled:text-gray-400 transition-all font-medium text-xs text-gray-800"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Phone Number (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91 XXXXXXXXXX"
                  value={editingMember.phone}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg px-3.5 outline-none focus:border-[#4898E1] transition-all font-medium text-xs text-gray-800"
                />
              </div>

              {/* Role Assignment */}
              <div>
                <label className="block font-semibold text-gray-600 mb-1">Assign Role *</label>
                <select
                  value={editingMember.role_id}
                  onChange={(e) => setEditingMember({ ...editingMember, role_id: e.target.value })}
                  className="w-full h-11 border border-gray-200 rounded-lg px-3 outline-none focus:border-[#4898E1] bg-white transition-all font-medium text-xs text-gray-800"
                >
                  <option value="" disabled>Select a role...</option>
                  {activeRolesOnly.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              {/* Password Fields (Only when creating) */}
              {!editingMember.id && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={editingMember.password}
                        onChange={(e) => {
                          setEditingMember({ ...editingMember, password: e.target.value });
                          checkPasswordStrength(e.target.value);
                        }}
                        className="w-full h-11 border border-gray-200 rounded-lg px-3.5 outline-none focus:border-[#4898E1] transition-all font-medium text-xs text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-gray-600 mb-1">Confirm Password *</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={editingMember.confirm_password}
                        onChange={(e) => setEditingMember({ ...editingMember, confirm_password: e.target.value })}
                        className="w-full h-11 border border-gray-200 rounded-lg px-3.5 outline-none focus:border-[#4898E1] transition-all font-medium text-xs text-gray-800"
                      />
                    </div>
                  </div>

                  {/* Password Strength Checklist */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-1.5 border border-gray-100">
                    <span className="font-bold text-gray-600 block text-[10px] mb-1">Password requirements:</span>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-medium text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className={passRules.length ? "text-emerald-600" : "text-gray-400"}>
                          {passRules.length ? "✔" : "○"}
                        </span>
                        <span>8 to 128 characters</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passRules.upper ? "text-emerald-600" : "text-gray-400"}>
                          {passRules.upper ? "✔" : "○"}
                        </span>
                        <span>Uppercase letter (A-Z)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passRules.lower ? "text-emerald-600" : "text-gray-400"}>
                          {passRules.lower ? "✔" : "○"}
                        </span>
                        <span>Lowercase letter (a-z)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={passRules.number ? "text-emerald-600" : "text-gray-400"}>
                          {passRules.number ? "✔" : "○"}
                        </span>
                        <span>Digit / Number (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <span className={passRules.special ? "text-emerald-600" : "text-gray-400"}>
                          {passRules.special ? "✔" : "○"}
                        </span>
                        <span>Special character (e.g. @, #, $, !, %, *, ?)</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Status/Active Toggle */}
              <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                <div>
                  <span className="font-semibold text-gray-800 block">Account status active</span>
                  <span className="text-[10px] text-gray-400">Controls if this admin is allowed to login and use roles</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editingMember.is_active}
                    onChange={(e) => setEditingMember({ ...editingMember, is_active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4898E1]"></div>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 pt-3 border-t mt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-md border px-4 py-2 hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveMember}
                disabled={saving}
                className="rounded-md bg-[#4898E1] hover:bg-[#4898E1]/90 px-4 py-2 text-white font-semibold flex items-center justify-center min-w-[90px] disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : editingMember.id ? (
                  "Update Member"
                ) : (
                  "Create Member"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM SOFT DELETE MODAL */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
          <div className="w-[min(380px,95vw)] rounded-xl bg-white p-5 shadow-xl border border-gray-100 text-xs">
            <div className="flex items-center gap-2.5 text-red-600 mb-3">
              <ShieldAlert size={20} className="shrink-0" />
              <h3 className="text-sm font-bold">Soft Delete Sub-Admin?</h3>
            </div>
            <p className="text-gray-500 mb-4 leading-relaxed font-medium">
              Are you sure you want to soft delete the sub-admin <strong className="text-gray-800">{isDeleteConfirmOpen.full_name}</strong>?
              They will be locked out and their profile status set to deleted.
            </p>
            <div className="flex justify-end gap-3 pt-2.5 border-t border-gray-100">
              <button
                onClick={() => setIsDeleteConfirmOpen(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMember}
                disabled={saving}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-semibold flex items-center justify-center min-w-[70px]"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM BLOCK/UNBLOCK MODAL */}
      {isBlockConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
          <div className="w-[min(380px,95vw)] rounded-xl bg-white p-5 shadow-xl border border-gray-100 text-xs">
            <div className={`flex items-center gap-2.5 ${isBlockConfirmOpen.block ? "text-red-600" : "text-emerald-600"} mb-3`}>
              {isBlockConfirmOpen.block ? <UserX size={20} /> : <Unlock size={20} />}
              <h3 className="text-sm font-bold">{isBlockConfirmOpen.block ? "Block Sub-Admin?" : "Unblock Sub-Admin?"}</h3>
            </div>
            <p className="text-gray-500 mb-4 leading-relaxed font-medium">
              Are you sure you want to {isBlockConfirmOpen.block ? "block" : "unblock"} <strong className="text-gray-800">{isBlockConfirmOpen.member.full_name}</strong>?
              {isBlockConfirmOpen.block ? " They will immediately lose access to all features and active JWT sessions will be invalidated." : " They will regain access to their assigned features."}
            </p>
            <div className="flex justify-end gap-3 pt-2.5 border-t border-gray-100">
              <button
                onClick={() => setIsBlockConfirmOpen(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBlockUnblock}
                disabled={saving}
                className={`px-4 py-2 ${isBlockConfirmOpen.block ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white rounded-md font-semibold flex items-center justify-center min-w-[70px]`}
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : isBlockConfirmOpen.block ? "Block" : "Unblock"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM FORCE RESET PASSWORD MODAL */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-[1px]">
          <div className="w-[min(390px,95vw)] rounded-xl bg-white p-5 shadow-xl border border-gray-100 text-xs">
            <div className="flex items-center gap-2.5 text-purple-600 mb-3">
              <KeyRound size={20} />
              <h3 className="text-sm font-bold">Force Password Reset?</h3>
            </div>
            <p className="text-gray-500 mb-4 leading-relaxed font-medium">
              This will generate a new random temporary password for <strong className="text-gray-800">{isResetConfirmOpen.full_name}</strong>,
              invalidate their active login sessions, and require them to update it.
              <br />
              <span className="text-red-500 font-semibold block mt-1.5">Note: This action cannot be undone.</span>
            </p>
            <div className="flex justify-end gap-3 pt-2.5 border-t border-gray-100">
              <button
                onClick={() => setIsResetConfirmOpen(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleForceResetPassword}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-semibold flex items-center justify-center min-w-[70px]"
              >
                {saving ? <Loader2 className="animate-spin" size={14} /> : "Force Reset"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PASSWORD RESET SUCCESS MODAL (Temporary Password Presentation) */}
      {tempPassword && resetDoneMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[1px] animate-fade-in">
          <div className="w-[min(420px,95vw)] rounded-xl bg-white p-6 shadow-2xl border border-purple-100 text-xs text-center space-y-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={26} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-800">Password Reset Successful</h3>
              <p className="text-gray-500 mt-1 font-medium">
                A temporary password has been successfully configured for <strong className="text-gray-700">{resetDoneMember.full_name}</strong>.
              </p>
            </div>

            <div className="bg-purple-50/50 border border-purple-150 rounded-lg p-3.5 flex items-center justify-between font-mono text-sm text-purple-900 select-all font-semibold gap-2">
              <span>{tempPassword}</span>
              <button
                onClick={() => copyToClipboard(tempPassword)}
                className="p-1.5 hover:bg-purple-100 text-purple-600 rounded-md transition-colors"
                title="Copy temporary password"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className="text-left bg-amber-50/70 border border-amber-150 rounded-lg p-3 text-[10px] text-amber-800 leading-normal font-semibold flex gap-2">
              <AlertCircle size={15} className="shrink-0 text-amber-600 mt-0.5" />
              <span>
                Please copy this temporary password immediately. For security reasons, it cannot be shown to you again. Give it securely to the sub-admin.
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => { setTempPassword(null); setResetDoneMember(null); }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold text-xs transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST SYSTEM */}
      {toast && (
        <div 
          className="fixed top-4 right-4 z-[999] flex items-center gap-2.5 bg-white border-l-4 shadow-xl rounded-lg py-3.5 px-4 max-w-sm transition-all duration-300 font-medium"
          style={{ 
            borderLeftColor: toast.type === "success" ? "#10B981" : toast.type === "error" ? "#EF4444" : "#3B82F6",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          }}
        >
          {toast.type === "success" ? (
            <CheckCircle className="text-emerald-500 shrink-0" size={17} />
          ) : toast.type === "error" ? (
            <AlertCircle className="text-red-500 shrink-0" size={17} />
          ) : (
            <AlertCircle className="text-blue-500 shrink-0" size={17} />
          )}
          <p className="text-xs text-gray-700 leading-snug">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
