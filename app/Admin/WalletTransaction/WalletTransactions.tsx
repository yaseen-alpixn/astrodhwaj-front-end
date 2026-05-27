"use client";

import { Eye, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency, formatDate, qs, titleCase, type ApiMeta } from "../api";

type Transaction = {
  id: string;
  order_id: string;
  amount: number;
  method?: string;
  transaction_type: string;
  status: string;
  created_at?: string;
  metadata?: { user_name?: string; details?: string };
};

type Props = {
  page?: number;
  search?: string;
  type?: string;
  onMetaChange?: (meta: ApiMeta | null) => void;
};

const typeMap: Record<string, string> = {
  Recharge: "recharge",
  Consultations: "consultation",
  Withdrawals: "withdrawal",
};

export default function WalletTransactions({ page = 1, search = "", type = "All", onMetaChange }: Props) {
  const [data, setData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<Transaction[]>(`/admin/transactions${qs({ page, limit: 9, search, transaction_type: typeMap[type] || type })}`)
      .then((response) => {
        setData(response.data || []);
        onMetaChange?.(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setData([]);
        onMetaChange?.(null);
        setError(err instanceof Error ? err.message : "Unable to load transactions");
      })
      .finally(() => setLoading(false));
  }, [page, search, type, onMetaChange]);

  const colorFor = (value: string) => {
    if (["completed", "success", "recharge"].includes(value)) return "bg-green-100 text-green-600";
    if (["pending", "consultation"].includes(value)) return "bg-[#4898E1]/10 text-[#4898E1]";
    if (["withdrawal", "withdrawals", "failed"].includes(value)) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="min-w-[1300px] w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">Order ID</th>
            <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">User / Details</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Amount</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Method</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Type</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Status</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Date & Time</th>
            <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr><td className="p-6 text-center text-gray-500" colSpan={8}>Loading...</td></tr>
          )}
          {!loading && error && (
            <tr><td className="p-6 text-center text-red-500" colSpan={8}>{error}</td></tr>
          )}
          {!loading && !error && data.length === 0 && (
            <tr><td className="p-6 text-center text-gray-500" colSpan={8}>No transactions found</td></tr>
          )}
          {data.map((item, i) => (
            <tr key={item.id || i} className="border-b last:border-none text-sm md:text-[14px]">
              <td className="p-3 whitespace-nowrap">{item.order_id}</td>
              <td className="p-3 whitespace-nowrap">{item.metadata?.user_name || item.metadata?.details || "-"}</td>
              <td className="p-3 text-center text-green-600 whitespace-nowrap">{formatCurrency(item.amount)}</td>
              <td className="p-3 text-center whitespace-nowrap">{item.method || "-"}</td>
              <td className="p-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${colorFor(item.transaction_type)}`}>
                  {titleCase(item.transaction_type)}
                </span>
              </td>
              <td className="p-3 text-center">
                <span className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${colorFor(item.status)}`}>
                  {titleCase(item.status)}
                </span>
              </td>
              <td className="p-3 text-center whitespace-nowrap text-xs md:text-sm">{formatDate(item.created_at)}</td>
              <td className="p-3">
                <div className="flex justify-center items-center gap-3">
                  <Eye size={18} className="text-[#4898E1] cursor-pointer" />
                  <MoreVertical size={18} className="cursor-pointer" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
