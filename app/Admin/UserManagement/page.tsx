"use client";

import ExportButton from "../CommonComponents/ExportButton";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  IndianRupee,
} from "lucide-react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import Link from "next/link";
import { adminApi, formatCurrency, formatDate, qs, titleCase, type ApiMeta } from "../api";

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  status: string;
  wallet_balance?: number;
  total_sessions?: number;
  total_spent?: number;
  created_at?: string;
};

export default function Page() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [statsData, setStatsData] = useState({
    total_users: 0,
    active_users: 0,
    blocked_users: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    adminApi<Record<string, number>>("/admin/users/stats")
      .then((response) => setStatsData((current) => ({ ...current, ...response.data })))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    adminApi<AdminUser[]>(`/admin/users${qs({ page, limit: 9, search, status })}`)
      .then((response) => {
        setUsers(response.data || []);
        setMeta(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setUsers([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unable to load users");
      })
      .finally(() => setLoading(false));
  }, [page, search, status]);

  const stats = useMemo(
    () => [
      {
        title: "Total Users",
        value: String(statsData.total_users),
        icon: <Users className="h-5 w-5 text-yellow-600" />,
        bg: "bg-yellow-100",
        color: "text-yellow-600",
      },
      {
        title: "Active Users",
        value: String(statsData.active_users),
        icon: <UserCheck className="h-5 w-5 text-[#4898E1]" />,
        bg: "bg-[#4898E1]/10",
        color: "text-[#4898E1]",
      },
      {
        title: "Blocked Users",
        value: String(statsData.blocked_users),
        icon: <UserX className="h-5 w-5 text-red-600" />,
        bg: "bg-red-100",
        color: "text-red-600",
      },
      {
        title: "Total Revenue",
        value: formatCurrency(statsData.total_revenue),
        icon: <IndianRupee className="h-5 w-5 text-green-600" />,
        bg: "bg-green-100",
        color: "text-green-600",
      },
    ],
    [statsData]
  );

  return (
    <>
      <AdminTopHeader />

      <main className="min-h-screen w-full overflow-x-hidden bg-white px-3 py-6 sm:px-5 md:px-8">
        <div className="mx-auto  space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                User Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage and monitor all registered users
              </p>
            </div>

            <ExportButton />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 lg:max-w-[800px] xl:max-w-full">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm flex  flex-col justify-start gap-1"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}
                >
                  {item.icon}
                </div>
                <h3 className="text-2xl font-semibold">{item.value}</h3>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between mb-6">
              <div className="flex items-center gap-2 border rounded-xl px-4 h-11 w-1/2 xl:max-w-md">
                <Search size={18} />
                <input
                  className="w-full outline-none text-sm"
                  placeholder="Search users..."
                  value={search}
                  onChange={(event) => {
                    setPage(1);
                    setSearch(event.target.value);
                  }}
                />
              </div>

              <div className="flex  rounded-xl bg-gray-100 p-1 no-scrollbar">
                {["All", "Active", "Blocked", "Inactive"].map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(1);
                      setStatus(tab);
                    }}
                    className={`px-5 py-2 text-sm rounded-lg whitespace-nowrap ${
                      status === tab ? "bg-[#4898E1] text-white" : "text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50 border-b">
                  <tr className="text-left text-sm">
                    <th className="p-4">User ID</th>
                    <th>User Info</th>
                    <th>Wallet</th>
                    <th>Sessions</th>
                    <th>Status</th>
                    <th>Join Date</th>
                    <th>Contact</th>
                    <th className="text-right pr-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading && (
                    <tr><td className="p-6 text-center text-gray-500" colSpan={8}>Loading...</td></tr>
                  )}
                  {!loading && error && (
                    <tr><td className="p-6 text-center text-red-500" colSpan={8}>{error}</td></tr>
                  )}
                  {!loading && !error && users.length === 0 && (
                    <tr><td className="p-6 text-center text-gray-500" colSpan={8}>No users found</td></tr>
                  )}
                  {users.map((item, i) => {
                    const statusStyle =
                      item.status === "active"
                        ? "bg-green-100 text-green-700"
                        : item.status === "blocked"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700";

                    return (
                      <tr key={item.id || i} className="border-b text-sm">
                        <td className="p-4">{item.id?.slice(-6).toUpperCase()}</td>
                        <td>{item.full_name}</td>

                        <td className="text-green-600 font-medium">{formatCurrency(item.wallet_balance)}</td>

                        <td>
                          <p>{item.total_sessions || 0}</p>
                          <p className="text-gray-500 text-xs">{formatCurrency(item.total_spent)} spent</p>
                        </td>

                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${statusStyle}`}
                          >
                            {titleCase(item.status)}
                          </span>
                        </td>

                        <td>{formatDate(item.created_at)}</td>

                        <td className="py-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 break-all text-xs">
                              <Mail size={14} />
                              {item.email}
                            </div>

                            <div className="flex items-center gap-1 break-all text-xs">
                              <Phone size={14} />
                              {item.phone || "-"}
                            </div>
                          </div>
                        </td>

                        <td className="relative">
                          <div className="flex justify-end gap-2 pr-4">
                            <Link href={`/Admin/UserManagement/UserPopUp?id=${item.id}`}>
                              <Eye
                                size={18}
                                className="text-[#4898E1] cursor-pointer"
                              />
                            </Link>
                            <MoreVertical
                              size={18}
                              className="cursor-pointer"
                              onClick={() => {
                                setActiveDropdown(activeDropdown === item.id ? null : item.id);
                              }}
                            />
                            {activeDropdown === item.id && (
                              <div className="absolute right-4 mt-6 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 border border-gray-100">
                                <div className="py-1">
                                  <button
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      const action = item.status === "blocked" ? "unblock" : "block";
                                      adminApi(`/admin/users/${item.id}/${action}`, { method: "PATCH" }).then(() => {
                                        setUsers((current) =>
                                          current.map((user) =>
                                            user.id === item.id
                                              ? { ...user, status: action === "block" ? "blocked" : "active" }
                                              : user
                                          )
                                        );
                                      });
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    {item.status === "blocked" ? "Activate User" : "Suspend User"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveDropdown(null);
                                      if (confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) {
                                        adminApi(`/admin/users/${item.id}`, { method: "DELETE" }).then(() => {
                                          setUsers((current) => current.filter((u) => u.id !== item.id));
                                        });
                                      }
                                    }}
                                    className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    Delete User
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
              <button className="w-10 h-10 rounded-md border flex items-center justify-center" onClick={() => setPage((current) => Math.max(1, current - 1))}>
                <ChevronLeft size={18} />
              </button>

              <p className="text-sm md:text-base">Page {meta?.page || page} of {meta?.total_pages || 1}</p>

              <button className="w-10 h-10 rounded-md border flex items-center justify-center" onClick={() => setPage((current) => Math.min(meta?.total_pages || current, current + 1))}>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
