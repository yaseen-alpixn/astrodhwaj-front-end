"use client";

// components/pricing/TopAstrologers.tsx
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";

type TopAstrologer = {
  rank: number;
  name: string;
  revenue: number;
  sessions: number;
  commission: number;
  progress: number;
};

export default function TopAstrologers() {
  const [data, setData] = useState<TopAstrologer[]>([]);

  useEffect(() => {
    adminApi<TopAstrologer[]>("/admin/pricing/top-astrologers")
      .then((response) => setData(response.data || []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="mt-6  rounded-[10px] p-5 bg-white shadow-sm">
      <h2 className="text-[20px] font-semibold">Top 5 Performing Astrologers</h2>
      <p className="text-[14px] font-medium text-gray-500 mb-4">
        Highest commission contributors this month
      </p>

      {data.map((item, i) => (
        <div key={i} className="mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] flex items-center justify-center text-[#4898E1] font-medium">
                {String(item.rank).padStart(2, "0")}
              </div>

              <div>
                <p className="font-medium text-[15px]">{item.name}</p>
                <p className="text-gray-500 text-sm">
                  Revenue: {formatCurrency(item.revenue)} • {item.sessions} Sessions
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[#4898E1] font-medium text-[15px]">{formatCurrency(item.commission)}</p>
              <p className="text-sm text-gray-500">Commission</p>
            </div>
          </div>

          <div className="mt-3 w-full h-[8px] bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#4898E1] rounded-full transition-all duration-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
