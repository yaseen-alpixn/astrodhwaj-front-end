"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { adminApi, formatCurrency } from "../api";

type TrendResponse = {
  user_trend: { date: string; users: number }[];
  revenue_trend: { date: string; revenue: number; count: number }[];
};

const shortDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short" }).format(date);
};

export default function ReportAnalyticsTrendSection() {
  const [trends, setTrends] = useState<TrendResponse>({ user_trend: [], revenue_trend: [] });
  const [userSearch, setUserSearch] = useState("");
  const [revenueSearch, setRevenueSearch] = useState("");

  useEffect(() => {
    adminApi<TrendResponse>("/admin/analytics/trends?days=30")
      .then((response) => setTrends(response.data))
      .catch(() => undefined);
  }, []);

  const users = useMemo(
    () => trends.user_trend.filter((item) => item.date.toLowerCase().includes(userSearch.toLowerCase())).slice(-6),
    [trends.user_trend, userSearch],
  );
  const revenue = useMemo(
    () => trends.revenue_trend.filter((item) => item.date.toLowerCase().includes(revenueSearch.toLowerCase())).slice(-6),
    [trends.revenue_trend, revenueSearch],
  );
  const maxUsers = Math.max(1, ...users.map((item) => item.users));
  const maxRevenue = Math.max(1, ...revenue.map((item) => item.revenue));

  return (
    <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base md:text-[17px] font-medium">
            User Growth Trend
          </h2>

          <div className="relative w-full sm:max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              className="h-[40px] w-full rounded-lg border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
              placeholder="Search by week, date..."
            />
          </div>
        </div>

        {users.map((item) => (
          <div key={item.date} className="mb-5">
            <div className="flex justify-between items-center text-sm flex-wrap gap-2">
              <span>{shortDate(item.date)}</span>
              <span className="text-gray-700">{item.users.toLocaleString("en-IN")} Users</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.max(5, (item.users / maxUsers) * 100)}%` }} />
            </div>
          </div>
        ))}
        {users.length === 0 && <p className="text-sm text-gray-500">No user growth data</p>}
      </div>

      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base md:text-[17px] font-medium">
            Revenue Overview
          </h2>

          <div className="relative w-full sm:max-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={revenueSearch}
              onChange={(event) => setRevenueSearch(event.target.value)}
              className="h-[40px] w-full rounded-lg border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
              placeholder="Search by month, date..."
            />
          </div>
        </div>

        {revenue.map((item) => (
          <div key={item.date} className="mb-5">
            <div className="flex justify-between items-center text-sm flex-wrap gap-2">
              <span>{shortDate(item.date)}</span>
              <span className="text-green-600 font-medium">{formatCurrency(item.revenue)}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.max(5, (item.revenue / maxRevenue) * 100)}%` }} />
            </div>
          </div>
        ))}
        {revenue.length === 0 && <p className="text-sm text-gray-500">No revenue data</p>}
      </div>
    </div>
  );
}
