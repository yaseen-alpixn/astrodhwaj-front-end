"use client";

// components/pricing/ProjectedRevenue.tsx
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";

type Projection = {
  label: string;
  projected_commission: number;
};

export default function ProjectedRevenue() {
  const [data, setData] = useState<Projection[]>([]);

  useEffect(() => {
    adminApi<Projection[]>("/admin/pricing/projections")
      .then((response) => setData(response.data || []))
      .catch(() => setData([]));
  }, []);

  return (
    <div className="mt-6 bg-gradient-to-r from-[#0DAD9A] to-[#0ED20B] p-5 rounded-[10px] text-white shadow-sm">
      <h2 className="text-[20px] font-semibold mb-4">
        Projected Monthly Revenue from Commission
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex-1 border border-white/30 rounded-[10px] p-2"
          >
            <p>{item.label}</p>
            <h3 className="text-[20px] font-semibold mt-2">{formatCurrency(item.projected_commission)}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
