"use client";

import { useEffect, useState } from "react";
import { Bell, Search, User } from "lucide-react";
import Link from "next/link";
import { adminApi } from "../api";

type AlertSourceItem = {
  id?: string;
  _id?: string;
};

type DashboardAlerts = {
  recent_transactions?: AlertSourceItem[];
};

export default function AdminTopHeader() {
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function checkAlerts() {
      try {
        const readAlerts: string[] = JSON.parse(localStorage.getItem("admin_read_alerts") || "[]");
        const deletedAlerts: string[] = JSON.parse(localStorage.getItem("admin_deleted_alerts") || "[]");

        let unreadCount = 0;

        // 1. Check pending astrologer requests
        const reqs = await adminApi<AlertSourceItem[]>("/admin/astrologer-requests?status=pending");
        if (reqs.success && reqs.data) {
          reqs.data.forEach((req) => {
            const id = `astro-req-${req.id || req._id}`;
            if (!readAlerts.includes(id) && !deletedAlerts.includes(id)) {
              unreadCount++;
            }
          });
        }

        // 2. Check recent users
        const users = await adminApi<AlertSourceItem[]>("/admin/users?limit=10");
        if (users.success && users.data) {
          users.data.forEach((user) => {
            const id = `user-reg-${user.id || user._id}`;
            if (!readAlerts.includes(id) && !deletedAlerts.includes(id)) {
              unreadCount++;
            }
          });
        }

        // 3. Check recent transactions from dashboard overview
        const dbInfo = await adminApi<DashboardAlerts>("/admin/dashboard");
        if (dbInfo.success && dbInfo.data?.recent_transactions) {
          dbInfo.data.recent_transactions.forEach((tx) => {
            const id = `tx-log-${tx.id || tx._id}`;
            if (!readAlerts.includes(id) && !deletedAlerts.includes(id)) {
              unreadCount++;
            }
          });
        }

        setHasUnread(unreadCount > 0);
      } catch {
        setHasUnread(false);
      }
    }
    checkAlerts();
  }, []);

  return (
    <div className="flex w-full flex-col items-start justify-between gap-3 bg-white p-2 sm:flex-row sm:items-center sm:gap-4 border-b border-gray-100">
      <div className="flex h-[43px] w-full min-w-0 items-center gap-[10px] rounded-[10px] border border-gray-300 p-[15px] sm:w-[347px]">
        <Search className="h-[18px] w-[18px] text-gray-600" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
        />
      </div>

      <div className="flex items-center gap-[15px]">
        <Link 
          href="/Admin/Notifications" 
          className="flex h-[35px] w-[35px] items-center justify-center rounded-lg bg-gray-50 border text-gray-700 hover:text-[#4898E1] hover:bg-[#4898E1]/10 transition-all relative"
          title="System Notification Alerts"
        >
          <Bell className="h-[18px] w-[18px]" />
          {hasUnread && (
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[8px] font-bold text-white flex items-center justify-center animate-pulse">
              !
            </span>
          )}
        </Link>
        <Link 
          href="/Admin/AdminSettings" 
          className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#4898E1]/10 hover:text-[#4898E1] transition-all"
          title="Admin Settings"
        >
          <User className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </div>
  );
}
