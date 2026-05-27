"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { adminApi, formatDate } from "../../api";
import UserSections, { type UserDetail } from "./UserSections";

export default function UserAnalyticsModal({ onClose }: { onClose?: () => void }) {
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;

    adminApi<UserDetail>(`/admin/users/${userId}`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load user details");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const toggleBlockStatus = () => {
    if (!user) return;
    const isBlocked = user.status === "blocked";
    const action = isBlocked ? "unblock" : "block";
    adminApi(`/admin/users/${user._id || user.id}/${action}`, { method: "PATCH" })
      .then(() => {
        setUser((curr) => curr ? { ...curr, status: isBlocked ? "active" : "blocked" } : curr);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to toggle user status"));
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="max-h-[90vh] w-[min(900px,95vw)] overflow-y-auto rounded-xl bg-white p-4 md:p-6 shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-3">
          <h1 className="text-[20px] font-bold text-gray-800">User Profile Analytics</h1>
          <X className="cursor-pointer text-gray-500 hover:text-black transition" onClick={onClose} />
        </div>

        {loading && userId ? (
          <div className="flex h-[350px] items-center justify-center">
            <div className="text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#4898E1] border-t-transparent mx-auto"></div>
              <p className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fetching Seeker Profile...</p>
            </div>
          </div>
        ) : (!userId || error) ? (
          <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center text-sm font-semibold text-red-600">
            {!userId ? "User ID is missing" : error}
          </div>
        ) : user ? (
          <>
            {/* User Info Card */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 p-4 rounded-xl mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-tr from-[#4898E1] to-[#7f2cff] text-white rounded-full flex items-center justify-center font-bold text-[18px] shadow-sm">
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                </div>

                <div>
                  <h2 className="font-bold text-[18px] text-gray-900 leading-snug">{user.full_name}</h2>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">UID: {user._id || user.id}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3.5 text-xs font-semibold text-gray-600">
                <span className={`px-3 py-1 rounded-full ${
                  user.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {user.status ? user.status.toUpperCase() : "ACTIVE"}
                </span>
                <span>Joined {formatDate(user.created_at)}</span>
                {user.last_login_at && (
                  <span>Last active: {formatDate(user.last_login_at)}</span>
                )}
              </div>
            </div>

            {/* Sections */}
            <UserSections user={user} onUserUpdate={(patch) => setUser((current) => current ? { ...current, ...patch } : current)} />

            {/* Footer Buttons */}
            <div className="flex justify-center gap-4 mt-6 border-t border-gray-100 pt-5">
              <button
                onClick={() => {
                  window.location.href = `mailto:${user.email}`;
                }}
                className="bg-[#4898E1] hover:bg-[#3d83c3] active:scale-95 transition text-white px-6 py-2 rounded-md font-semibold text-sm shadow-md"
              >
                Send Email
              </button>
              <button
                onClick={toggleBlockStatus}
                className={`border px-6 py-2 rounded-md font-semibold text-sm active:scale-95 transition ${
                  user.status === "blocked"
                    ? "border-green-500 text-green-600 hover:bg-green-50"
                    : "border-red-500 text-red-600 hover:bg-red-50"
                }`}
              >
                {user.status === "blocked" ? "Unblock User" : "Block User"}
              </button>
            </div>
          </>
        ) : null}

      </div>
    </div>
  );
}
