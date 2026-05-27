"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Trash } from "lucide-react";
import { adminApi, formatCurrency } from "../api";

type AnalyticsCategory = {
  category: string;
  sessions: number;
  revenue: number;
};

type TrendResponse = {
  categories: AnalyticsCategory[];
};

const filters = [
  { label: "All", days: 365 },
  { label: "Month", days: 30 },
  { label: "Quarter", days: 90 },
  { label: "Year", days: 365 },
];

export default function ReportAnalyticsCategory() {
  const [rows, setRows] = useState<AnalyticsCategory[]>([]);
  const [search, setSearch] = useState("");
  const [days, setDays] = useState(365);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    adminApi<TrendResponse>(`/admin/analytics/trends?days=${days}`)
      .then((response) => setRows(response.data.categories || []))
      .catch(() => setRows([]));
  }, [days]);

  const filteredRows = useMemo(
    () => rows.filter((row) => row.category.toLowerCase().includes(search.toLowerCase())),
    [rows, search],
  );
  const maxRevenue = Math.max(1, ...filteredRows.map((row) => row.revenue));

  return (
    <div className="mt-6 rounded-xl bg-white shadow-sm p-4 md:p-5">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, type, categories..."
            className="w-full h-[42px] pl-10 pr-4 rounded-lg border text-sm md:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.label}
              onClick={() => {
                setDays(filter.days);
                setActiveFilter(filter.label);
              }}
              className={`px-4 py-2 rounded-lg text-sm md:text-[14px] whitespace-nowrap ${
                activeFilter === filter.label
                  ? "bg-[#4898E1] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">Category</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Sessions</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Revenue</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Growth</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Trend</th>
              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.category} className="border-b last:border-none text-sm md:text-[14px]">
                <td className="p-3 whitespace-nowrap capitalize">{row.category.replace(/_/g, " ")}</td>
                <td className="p-3 text-center whitespace-nowrap">{row.sessions.toLocaleString("en-IN")}</td>
                <td className="p-3 text-center text-green-600 whitespace-nowrap">{formatCurrency(row.revenue)}</td>
                <td className="p-3 text-center">
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs md:text-sm whitespace-nowrap">-</span>
                </td>
                <td className="p-3">
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-full bg-[#4898E1] rounded-full" style={{ width: `${Math.max(5, (row.revenue / maxRevenue) * 100)}%` }} />
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex justify-center">
                    <Trash size={18} className="text-red-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td className="p-6 text-center text-sm text-gray-500" colSpan={6}>No analytics rows found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
