// app/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Users,
  Star,
  Radio,
  IndianRupee,
  CreditCard,
} from "lucide-react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminApi, formatCurrency } from "../api";

type DashboardData = {
  stats: Record<string, number | undefined>;
  charts?: { revenue_trend?: { date: string; revenue: number; transactions?: number }[] };
  recent_transactions?: {
    id: string;
    order_id?: string;
    transaction_type?: string;
    amount: number;
    status: string;
    metadata?: { user_name?: string; astrologer_name?: string };
  }[];
};

type LiveSessionData = {
  id: string;
  title: string;
  status: string;
  revenue?: number;
  metadata?: { astrologer_name?: string; duration_minutes?: number };
};

export default function Page() {
  const [dashboard, setDashboard] = useState<DashboardData>({ stats: {} });
  const [activity, setActivity] = useState<{ hour: number; sessions: number; viewers: number }[]>([]);
  const [sessions, setSessions] = useState<LiveSessionData[]>([]);
  const [growth, setGrowth] = useState<{ month: string; users: number }[]>([]);
  const [selectedDays, setSelectedDays] = useState(7);
  const [selectedActivityMode, setSelectedActivityMode] = useState("audio_call");

  useEffect(() => {
    adminApi<DashboardData>(`/admin/dashboard?days=${selectedDays}`).then((response) => setDashboard(response.data)).catch(() => undefined);
  }, [selectedDays]);

  useEffect(() => {
    adminApi<{ hour: number; sessions: number; viewers: number }[]>(`/admin/dashboard/activity?mode=${selectedActivityMode}`).then((response) => setActivity(response.data || [])).catch(() => undefined);
  }, [selectedActivityMode]);

  useEffect(() => {
    adminApi<LiveSessionData[]>("/admin/dashboard/active-sessions").then((response) => setSessions(response.data || [])).catch(() => undefined);
    adminApi<{ month: string; users: number }[]>("/admin/dashboard/user-growth").then((response) => setGrowth(response.data || [])).catch(() => undefined);
  }, []);

  const stats = useMemo(() => [
    {
      title: "Total Users",
      value: String(dashboard.stats.total_users || 0),
      change: `${dashboard.stats.user_growth || 0}%`,
      positive: (dashboard.stats.user_growth || 0) >= 0,
      icon: <Users size={20} className="text-[#005DB2]" />,
    },
    {
      title: "Astrologer",
      value: String(dashboard.stats.astrologers || 0),
      change: `${dashboard.stats.pending_approvals || 0} Pending`,
      positive: true,
      icon: <Star size={20} className="text-[#005DB2]" />,
    },
    {
      title: "Live Streams",
      value: String(dashboard.stats.total_live_streams || 0),
      change: `${dashboard.stats.active_sessions || 0} Active`,
      positive: true,
      icon: <Radio size={20} className="text-[#005DB2]" />,
    },
    {
      title: "Revenue",
      value: formatCurrency(dashboard.stats.revenue),
      change: `${dashboard.stats.revenue_growth || 0}%`,
      positive: (dashboard.stats.revenue_growth || 0) >= 0,
      icon: <IndianRupee size={20} className="text-[#005DB2]" />,
    },
    {
      title: "Withdrawals",
      value: formatCurrency(dashboard.stats.withdrawals || 0),
      change: `${dashboard.stats.pending_withdrawals || 0} Pending`,
      positive: false,
      icon: <CreditCard size={20} className="text-[#005DB2]" />,
    },
  ], [dashboard.stats]);

  const bars = activity.map((item) => Math.min(80, Math.max(6, item.sessions * 16 + item.viewers / 12)));
  const revenue = dashboard.charts?.revenue_trend || [];
  const maxRevenue = Math.max(...revenue.map((item) => item.revenue), 1);
  const maxGrowth = Math.max(...growth.map((item) => item.users), 1);
  const transactions = dashboard.recent_transactions || [];
  return (
    <>
      <AdminTopHeader />
      <main className="min-h-screen py-8 pl-5 pr-2 bg-white font-sans">
        <div className="max-w-[1500px] mx-auto space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[28px] font-semibold">Dashboard Overview</p>
              <p className="text-[14px] font-medium text-gray-500">
                Welcome back! Here&apos;s what&apos;s happening today.
              </p>
            </div>

            <div className="relative w-full md:w-[170px]">
              <select
                value={selectedDays}
                onChange={(e) => setSelectedDays(Number(e.target.value))}
                className="appearance-none flex h-[42px] w-full items-center justify-between rounded-lg border border-slate-200 bg-[#4898E1]/10 px-4 py-2 pr-8 text-[14px] font-semibold text-slate-800 outline-none cursor-pointer focus:border-[#4898E1]"
              >
                <option value="1">Today</option>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">All Time</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Five Cards Same Line */}
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 h-[130px] shadow-sm w-full min-w-0 flex flex-col justify-between border border-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-[40px] h-[40px] shrink-0 rounded-lg bg-[#E8F4FF] flex items-center justify-center">
                    {item.icon}
                  </div>
                  <p className="text-[14px] font-semibold text-slate-800 whitespace-nowrap">
                    {item.title}
                  </p>
                </div>

                <div>
                  <h3 className="text-[20px] font-bold text-slate-800 truncate">
                    {item.value}
                  </h3>

                  <div
                    className={`mt-1 text-[13px] flex items-center gap-1 font-semibold ${
                      item.positive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.positive ? (
                      <ArrowUpRight size={14} className="text-green-600" />
                    ) : (
                      <ArrowDownRight size={14} className="text-red-500" />
                    )}
                    <span className="truncate">{item.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h2 className="text-[20px] font-semibold">
                  24-Hour Activity Distribution
                </h2>
                <p className="text-[14px] font-medium text-gray-500 mt-1">
                  Hourly session patterns across all services
                </p>
              </div>

              <div className="relative w-[150px]">
                <select
                  value={selectedActivityMode}
                  onChange={(e) => setSelectedActivityMode(e.target.value)}
                  className="appearance-none flex h-[42px] w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 pr-8 text-[14px] font-semibold text-slate-800 outline-none cursor-pointer focus:border-[#4898E1]"
                >
                  <option value="audio_call">Audio Call</option>
                  <option value="chat_session">Chat Session</option>
                  <option value="video_call">Video Call</option>
                  <option value="live_session">Live Streams</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-600">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            <div className="mt-8 h-[180px] flex items-end gap-2">
              {bars.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-xs bg-gradient-to-b from-[#4898E1] to-[#005DB2]"
                  style={{ height: `${bar * 2.4}px` }}
                />
              ))}
            </div>

            <div className="flex justify-between font-medium text-[14px] text-gray-500 mt-4">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Revenue + Growth */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Revenue */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">
                    Revenue Overview
                  </h2>
                  <p className="text-[14px] font-medium text-gray-500 mt-2">
                    Daily revenue for the last 7 days
                  </p>
                </div>

                <Link href="/Admin/WalletTransaction">
                  <button className="text-[16px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {revenue.slice(-7).map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-[15px] font-medium">
                        {new Date(item.date).toLocaleDateString("en-IN", { weekday: "long" })}
                        <span className="text-gray-400 font-normal">
                          {" "}
                          • {item.transactions || 0} Txns
                        </span>
                      </p>

                      <p className="text-[16px] font-semibold">{formatCurrency(item.revenue)}</p>
                    </div>

                    <div className="h-[9px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4898E1] rounded-full"
                        style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth */}
            <div className="bg-white  rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">User Growth</h2>
                  <p className="text-[14px] font-medium whitespace-nowrap text-gray-500 mt-2">
                    Monthly user registrations (last 6 months)
                  </p>
                </div>

                <Link href="/Admin/UserManagement">
                  <button className="text-[16px] whitespace-nowrap font-medium text-[#4898E1] text-start">
                    Manage Users
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {growth.map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-[15px] font-medium">{item.month}</p>
                      <p className="text-[16px] font-semibold">{item.users} Users</p>
                    </div>

                    <div className="h-[9px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${(item.users / maxGrowth) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Two Boxes */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Sessions */}
            <div className="bg-white  rounded-2xl p-5 shadow-sm">
              <div className="flex itmes-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">Active Sessions</h2>
                  <p className="text-[16px] font-normal text-gray-500 mt-2">
                    {sessions.length} ongoing consultations
                  </p>
                </div>

                <Link href="/Admin/LiveSession">
                  <button className="text-[17px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {sessions.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] text-[#4898E1] flex items-center justify-center text-[14px] font-medium">
                        {(item.metadata?.astrologer_name || "AS").slice(0, 2).toUpperCase()}
                      </div>

                      <div>
                        <h4 className="text-[15px] font-medium">
                          {item.metadata?.astrologer_name || "Astrologer"}
                        </h4>
                        <p className="text-[15px]  text-gray-500">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className="px-3 py-1 rounded-full inline-flex gap-1 items-center text-[14px] font-medium bg-blue-100 text-blue-700"
                      >
                        <Phone size={12} />
                        {item.status}
                      </span>

                      <p className="text-[12px] font-normal text-gray-500 mt-2">
                        {item.metadata?.duration_minutes || 0} min • {formatCurrency(item.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white  rounded-2xl p-5  shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold">
                    Recent Transactions
                  </h2>
                  <p className="text-[15px] font-medium text-gray-500">
                    Latest financial activities
                  </p>
                </div>

                <Link href="/Admin/WalletTransaction">
                  <button className="text-[16px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {transactions.map((item, i) => {
                  const positive = item.transaction_type !== "withdrawal";
                  return (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          positive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {positive ? (
                          <ArrowDownRight size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>

                      <div>
                        <h4 className="text-[15px] font-medium">{item.metadata?.user_name || item.metadata?.astrologer_name || "Transaction"}</h4>
                        <p className="text-[16px] text-gray-500">
                          {item.transaction_type || "transaction"} • {item.order_id}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <h4
                        className={`text-[18px] font-medium ${
                          positive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {positive ? "+" : "-"}{formatCurrency(item.amount)}
                      </h4>

                      <p className="text-[14px] font-normal  text-gray-500 mt-1">
                        {item.status}
                      </p>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
