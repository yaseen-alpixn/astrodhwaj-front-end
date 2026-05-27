"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";

export default function WalletStatsCards() {
  const [stats, setStats] = useState({
    withdrawals: 0,
    consultations: 0,
    recharges: 0,
    total_revenue: 0,
  });

  useEffect(() => {
    adminApi<typeof stats>("/admin/transactions/stats")
      .then((response) => setStats((current) => ({ ...current, ...response.data })))
      .catch(() => undefined);
  }, []);

  const cards = [
    {
      label: "Withdrawals",
      value: formatCurrency(stats.withdrawals),
      src: "/images/walletWithdraw.png",
      bg: "bg-blue-100",
    },
    {
      label: "Consultations",
      value: formatCurrency(stats.consultations),
      src: "/images/walletUser.png",
      bg: "bg-yellow-100",
    },
    {
      label: "Recharges",
      value: formatCurrency(stats.recharges),
      src: "/images/walletRecharge.png",
      bg: "bg-orange-100",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats.total_revenue),
      src: "/images/walletRevenue.png",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-[800px] xl:grid-cols-4 xl:max-w-full">
      {cards.map((card, i) => (
        <div
          key={i}
          className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between"
        >
          <div className={`w-[40px] h-[40px] rounded-lg ${card.bg} flex items-center justify-center`}>
            <Image
              src={card.src}
              width={15}
              height={15}
              alt={card.label + " icon"}
              className="object-cover"
            />
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
