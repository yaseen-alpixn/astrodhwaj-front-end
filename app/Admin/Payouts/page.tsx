"use client";

import { useCallback, useEffect, useState } from "react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminApi, formatCurrency, formatDate } from "../api";

type Payout = {
  id: string;
  amount: number;
  status: string;
  method?: string;
  failure_reason?: string | null;
  requested_at?: string;
  processed_at?: string | null;
  razorpay_payout_id?: string | null;
};

type PayoutStats = Record<string, { count: number; amount: number }>;

const statusClass: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  completed: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
  reversed: "bg-red-50 text-red-700",
};

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState<PayoutStats>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    setLoading(true);
    Promise.all([
      adminApi<Payout[]>("/admin/payouts?page=1&limit=50"),
      adminApi<PayoutStats>("/admin/payouts/stats"),
    ])
      .then(([payoutResponse, statsResponse]) => {
        setPayouts(payoutResponse.data || []);
        setStats(statsResponse.data || {});
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load payouts"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(load, 0);
    return () => window.clearTimeout(timer);
  }, [load]);

  const retry = (id: string) => {
    adminApi(`/admin/payouts/${id}/retry`, { method: "POST" })
      .then(load)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to retry payout"));
  };

  return (
    <>
      <AdminTopHeader />
      <main className="min-h-screen bg-white px-5 py-8">
        <div className="mb-6">
          <h1 className="text-[24px] font-semibold text-[#111111]">Payouts</h1>
          <p className="text-sm text-gray-500">Astrologer withdrawal monitoring</p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {["pending", "processing", "completed", "failed", "reversed"].map((status) => (
            <div key={status} className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium capitalize text-gray-500">{status}</p>
              <h2 className="mt-2 text-[20px] font-semibold">{formatCurrency(stats[status]?.amount || 0)}</h2>
              <p className="text-xs text-gray-500">{stats[status]?.count || 0} requests</p>
            </div>
          ))}
        </div>

        <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm">
          {loading && <p className="py-6 text-center text-sm text-gray-500">Loading...</p>}
          {error && <p className="py-4 text-center text-sm text-red-500">{error}</p>}
          {!loading && !error && payouts.length === 0 && <p className="py-6 text-center text-sm text-gray-500">No payouts found</p>}

          {!loading && payouts.length > 0 && (
            <div className="w-full overflow-x-auto">
              <table className="min-w-[900px] w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm">
                    <th className="p-3 font-medium">Requested</th>
                    <th className="p-3 font-medium">Amount</th>
                    <th className="p-3 font-medium">Method</th>
                    <th className="p-3 font-medium">Status</th>
                    <th className="p-3 font-medium">Razorpay ID</th>
                    <th className="p-3 font-medium">Failure</th>
                    <th className="p-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="border-b text-sm last:border-none">
                      <td className="p-3">{formatDate(payout.requested_at)}</td>
                      <td className="p-3 font-semibold">{formatCurrency(payout.amount)}</td>
                      <td className="p-3 capitalize">{(payout.method || "-").replace(/_/g, " ")}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass[payout.status] || "bg-gray-50 text-gray-600"}`}>
                          {payout.status}
                        </span>
                      </td>
                      <td className="p-3">{payout.razorpay_payout_id || "-"}</td>
                      <td className="p-3 text-red-500">{payout.failure_reason || "-"}</td>
                      <td className="p-3 text-right">
                        {["failed", "reversed"].includes(payout.status) && (
                          <button onClick={() => retry(payout.id)} className="rounded-lg border border-[#4898E1] px-3 py-1 text-sm text-[#4898E1]">
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
