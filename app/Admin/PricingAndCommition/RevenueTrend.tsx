"use client";

// components/pricing/RevenueTrend.tsx
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency, titleCase } from "../api";

type Trend = {
  month: string;
  total: number;
  services: Record<string, number>;
};

const colors = ["from-blue-600 to-blue-400", "from-green-500 to-yellow-400", "from-yellow-400 to-red-500", "from-[#4898E1] to-[#4898E1]/80"];

export default function RevenueTrend() {
  const [months, setMonths] = useState<Trend[]>([]);

  useEffect(() => {
    adminApi<Trend[]>("/admin/pricing/trends")
      .then((response) => setMonths(response.data || []))
      .catch(() => setMonths([]));
  }, []);

  return (
    <div className="mt-6 bg-white rounded-[10px] p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold">Revenue Trend Analysis</h2>
          <p className="text-[14px] font-medium text-gray-500">
            3-month comparison across service types
          </p>
        </div>

        <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-gray-100 text-[14px]">
          {["Last 3 Weeks", "Last 3 Months", "Year"].map((t, i) => (
            <button
              key={i}
              className={`h-[31px] rounded-[5px] px-[10px] py-[5px] md:w-[120px] ${
                t === "Last 3 Months" ? "bg-[#4898E1] text-white" : "bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {months.map((month, i) => {
        const services = Object.entries(month.services || {});
        return (
          <div key={i} className="mt-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-[17px] font-medium">
                <Calendar size={18} />
                {month.month}
              </div>
              <span className="font-medium">{formatCurrency(month.total)}</span>
            </div>

            <div className="mt-3 flex h-[32px] w-full rounded-md overflow-hidden">
              {services.map(([label, value], idx) => {
                const percent = month.total ? Math.max(4, (value / month.total) * 100) : 0;
                return (
                  <div
                    key={label}
                    style={{ width: `${percent}%` }}
                    className={`flex items-center justify-center text-white text-[14px] font-medium bg-gradient-to-r ${colors[idx % colors.length]}`}
                  >
                    {Math.round(percent)}%
                  </div>
                );
              })}
            </div>

            <div className="mt-2 grid grid-cols-1 gap-1 text-[14px] text-gray-500 sm:grid-cols-2 lg:grid-cols-4">
              {services.map(([label, value]) => (
                <span key={label}>{titleCase(label)}: {formatCurrency(value)}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
