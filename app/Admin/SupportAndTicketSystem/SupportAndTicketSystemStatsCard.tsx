"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { adminApi } from "../api";

export default function SupportAndTicketSystemStatsCard() {
  const [stats, setStats] = useState({ total: 0, open: 0, in_progress: 0, closed: 0 });

  useEffect(() => {
    adminApi<typeof stats>("/admin/support-tickets/stats")
      .then((response) => setStats((current) => ({ ...current, ...response.data })))
      .catch(() => undefined);
  }, []);

  const cards = [
    { title: "Total Tickets", src: "/images/Support1.png", value: stats.total, color: "bg-[#4898E1]/10" },
    { title: "Open Tickets", src: "/images/Support2.png", value: stats.open, color: "bg-blue-100" },
    { title: "In Progress", src: "/images/Support3.png", value: stats.in_progress, color: "bg-yellow-100" },
    { title: "Closed", src: "/images/Support4.png", value: stats.closed, color: "bg-green-100" },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-[800px] xl:max-w-full">
      {cards.map((card, i) => (
        <div key={i} className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between">
          <div className={`w-[40px] h-[40px] rounded-lg ${card.color} flex items-center justify-center`}>
            <Image src={card.src} width={15} height={15} alt={card.title + " icon"} />
          </div>
          <div>
            <h2 className="text-[20px] font-medium">{card.value}</h2>
            <p className="text-[14px] font-medium">{card.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
