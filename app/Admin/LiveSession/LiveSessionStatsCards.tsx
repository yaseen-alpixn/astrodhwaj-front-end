"use client";

import { Radio, Users, IndianRupee, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";

export default function LiveSessionStatsCards() {
  const [stats, setStats] = useState({ active_sessions: 0, total_viewers: 0, live_earnings: 0, avg_duration: 0 });

  useEffect(() => {
    adminApi<typeof stats>("/admin/live-sessions/stats")
      .then((response) => setStats((current) => ({ ...current, ...response.data })))
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Active Sessions", value: String(stats.active_sessions), icon: <Radio />, bg: "bg-red-100" },
    { label: "Total Viewers", value: String(stats.total_viewers), icon: <Users />, bg: "bg-[#4898E1]/10" },
    { label: "Live Earnings", value: formatCurrency(stats.live_earnings), icon: <IndianRupee />, bg: "bg-yellow-100" },
    { label: "Avg Duration", value: `${stats.avg_duration} min`, icon: <Clock />, bg: "bg-blue-100" },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div key={i} className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className={`w-[40px] h-[40px] rounded-lg ${card.bg} flex items-center justify-center text-[#4898E1]`}>
            {card.icon}
          </div>

          <div>
            <h2 className="text-[20px] font-medium">{card.value}</h2>
            <p className="text-[14px] font-medium whitespace-nowrap">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
