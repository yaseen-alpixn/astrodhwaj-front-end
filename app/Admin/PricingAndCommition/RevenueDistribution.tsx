"use client";

// components/pricing/RevenueDistribution.tsx
import Image from "next/image";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";

type Distribution = {
  label: string;
  percentage: number;
  total_revenue: number;
  commission_rate: number;
  commission: number;
  sessions: number;
  avg_duration: number;
};

export default function RevenueDistribution() {
  const [cards, setCards] = useState<Distribution[]>([]);

  useEffect(() => {
    adminApi<Distribution[]>("/admin/pricing/revenue-distribution")
      .then((response) => setCards(response.data || []))
      .catch(() => setCards([]));
  }, []);

  return (
    <div className="mt-6 bg-white rounded-[10px] shadow-sm p-2 w-full">
      <h2 className="text-[20px] font-semibold">
        Revenue Distribution by Service
      </h2>
      <p className="text-[14px] font-medium text-gray-500 mb-4">
        Breakdown of earnings across all service types
      </p>

      <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item, i) => (
          <div
            key={i}
            className="h-[265px] w-full rounded-[10px] border-1 border-gray-200 p-[20px] flex flex-col justify-between gap-1"
          >
            <div className="flex items-center gap-2 justify-between">
              <div>
                <h3 className="text-[20px] font-medium text-[#4898E1]">
                  {item.percentage}%
                </h3>
                <p className="text-[16px] font-medium mt-1 text-[#4898E1]">
                  {item.label}
                </p>
              </div>
              <div className="flex items-center">
                <Image
                  src="/images/upwardArrow.png"
                  width={15}
                  height={15}
                  alt="Revenue increase arrow"
                />
                <span className="text-green-600">Live</span>
              </div>
            </div>

            <div className="text-[13px] flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Total Revenue</span>
                <span className="font-medium">{formatCurrency(item.total_revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission ({item.commission_rate}%)</span>
                <span className="font-medium text-red-500">{formatCurrency(item.commission)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sessions</span>
                <span className="font-medium">{item.sessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Duration</span>
                <span className="font-medium">{item.avg_duration} min</span>
              </div>
            </div>

            <div className="h-[9px] w-full rounded-full bg-gray-200">
              <div className="h-full bg-[#4898E1] rounded-full" style={{ width: `${item.percentage}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
