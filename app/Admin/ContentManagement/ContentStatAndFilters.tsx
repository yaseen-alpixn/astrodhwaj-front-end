"use client";

import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { adminApi } from "../api";

type Props = {
  search?: string;
  status?: string;
  onSearchChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
};

export default function ContentStatAndFilters({ search = "", status = "All", onSearchChange, onStatusChange }: Props) {
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, paused: 0, total_views: 0 });

  useEffect(() => {
    adminApi<typeof stats>("/admin/content/stats")
      .then((response) => setStats((current) => ({ ...current, ...response.data })))
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Total Content", value: stats.total, src: "/images/Content1.png", bg: "bg-blue-100" },
    { label: "Published", value: stats.published, src: "/images/Content2.png", bg: "bg-green-100" },
    { label: "Draft", value: stats.draft, src: "/images/Content3.png", bg: "bg-yellow-100" },
    { label: "Paused", value: stats.paused, src: "/images/Content4.png", bg: "bg-red-100" },
    { label: "Total Views", value: stats.total_views, src: "/images/Content5.png", bg: "bg-[#4898E1]/10" },
  ];

  const tabs = ["All", "Published", "Draft", "Paused"];

  return (
    <>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:max-w-[800px] xl:max-w-full">
        {cards.map((card, i) => (
          <div key={i} className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between">
            <div className={`w-[40px] h-[40px] rounded-lg ${card.bg} flex items-center justify-center`}>
              <Image src={card.src} width={15} height={15} alt={card.label + " icon"} />
            </div>
            <div>
              <h2 className="text-[20px] font-medium">{card.value}</h2>
              <p className="text-[14px] font-medium">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 bg-white p-2 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-[380px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
          <input placeholder="Search by title, type, categories..." value={search} onChange={(event) => onSearchChange?.(event.target.value)} className="w-full h-[43px] pl-10 pr-4 rounded-[10px] border text-center text-[16px]" />
        </div>

        <div className="flex  gap-[2px]">
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => onStatusChange?.(tab)} className={`h-[35px] rounded-[5px] px-4 text-[15px] font-medium md:w-[95px] ${tab === status ? "bg-[#4898E1] text-white" : "bg-gray-100 text-gray-600"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
