"use client";

import { useEffect, useState } from "react";
import { Activity, IndianRupee, Star, Users } from "lucide-react";
import { adminApi, formatCurrency } from "../api";

type AnalyticsOverview = {
  total_users: number;
  total_astrologers: number;
  total_revenue: number;
  consultations: number;
};

export default function ReportAnalyticsStatsCards() {
  const [overview, setOverview] = useState<AnalyticsOverview>({
    total_users: 0,
    total_astrologers: 0,
    total_revenue: 0,
    consultations: 0,
  });

  useEffect(() => {
    adminApi<AnalyticsOverview>("/admin/analytics/overview")
      .then((response) => setOverview(response.data))
      .catch(() => undefined);
  }, []);

  const cards = [
    {
      label: "Total Users",
      value: overview.total_users.toLocaleString("en-IN"),
      icon: <Users className="h-5 w-5 text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      label: "Astrologers",
      value: overview.total_astrologers.toLocaleString("en-IN"),
      icon: <Star className="h-5 w-5 text-[#4898E1]" />,
      bg: "bg-[#4898E1]/10",
    },
    {
      label: "Revenue",
      value: formatCurrency(overview.total_revenue),
      icon: <IndianRupee className="h-5 w-5 text-green-600" />,
      bg: "bg-green-100",
    },
    {
      label: "Consultations",
      value: overview.consultations.toLocaleString("en-IN"),
      icon: <Activity className="h-5 w-5 text-yellow-600" />,
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-[800px] xl:max-w-full">
      {cards.map((card) => (
        <div
          key={card.label}
          className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div
              className={`w-[40px] h-[40px] rounded-lg ${card.bg} flex items-center justify-center`}
            >
              {card.icon}
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-medium">{card.value}</h2>
            <p className="text-[14px] font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
