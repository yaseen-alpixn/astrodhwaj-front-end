"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PerformanceDashboardModal from "./PerformanceDashboardModal";
import { adminApi } from "../../api";

type TransactionRow = {
  id?: string;
  _id?: string;
  order_id?: string;
  transaction_type?: string;
  status?: string;
  amount?: number;
  payment_gateway?: string;
  method?: string;
  created_at?: string;
};

type AstrologerDetail = {
  display_name?: string;
  transactions?: TransactionRow[];
};

function AstrologerPopUpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [astrologerName, setAstrologerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      adminApi<AstrologerDetail>(`/admin/astrologers/${id}`)
        .then((response) => {
          setTransactions(response.data?.transactions || []);
          setAstrologerName(response.data?.display_name || "Astrologer");
        })
        .catch((err) => console.error("Failed to load astrologer detail", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8 font-[DM_Sans]">
      <div className="max-w-[1100px] mx-auto">
        {/* Top bar with back and button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {astrologerName ? `${astrologerName} Performance` : "Astrologer Performance"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View active sessions, transaction history, and pricing metrics.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/Admin/AstrologerManagement")}
              className="px-4 py-2 border rounded-lg bg-white text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Back to Management
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-[#4898E1] hover:bg-[#4898E1]/90 text-white px-5 py-2 rounded-lg font-medium shadow-sm transition-colors"
            >
              Open Performance Dashboard
            </button>
          </div>
        </div>

        {/* Table of Sessions taken by Astrologer */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Sessions Taken by Astrologer</h2>
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading sessions...</div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="p-3 font-semibold">Transaction ID</th>
                    <th className="p-3 font-semibold">Service Mode</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold">Amount</th>
                    <th className="p-3 font-semibold">Gateway</th>
                    <th className="p-3 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {transactions.map((tx) => (
                    <tr key={tx.id || tx._id} className="hover:bg-gray-50/50">
                      <td className="p-3 font-mono text-xs">{tx.order_id || tx.id || tx._id?.slice(-8)}</td>
                      <td className="p-3 capitalize">{tx.transaction_type || "Booking"}</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium capitalize">
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-3 font-semibold">₹{tx.amount}</td>
                      <td className="p-3 capitalize">{tx.payment_gateway || tx.method || "Wallet"}</td>
                      <td className="p-3 text-xs text-gray-500">
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("en-IN") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">No actual sessions logged in the database yet. Listing mock placeholders of astrologer sessions below:</p>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-left text-sm text-gray-500">
                  <thead className="bg-gray-50 text-gray-700 text-xs uppercase">
                    <tr>
                      <th className="p-3 font-semibold">Session ID</th>
                      <th className="p-3 font-semibold">Service Mode</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Amount</th>
                      <th className="p-3 font-semibold">Client Name</th>
                      <th className="p-3 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs text-[#4898E1]">SES-94A1D</td>
                      <td className="p-3">Audio Call</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Completed</span>
                      </td>
                      <td className="p-3 font-semibold text-gray-700">₹750</td>
                      <td className="p-3">Mohit Saini</td>
                      <td className="p-3">30 Mins</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs text-[#4898E1]">SES-83B2C</td>
                      <td className="p-3">Chat Session</td>
                      <td className="p-3">
                        <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Completed</span>
                      </td>
                      <td className="p-3 font-semibold text-gray-700">₹540</td>
                      <td className="p-3">Pooja Das</td>
                      <td className="p-3">30 Mins</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="p-3 font-mono text-xs text-[#4898E1]">SES-72C3F</td>
                      <td className="p-3">Video Call</td>
                      <td className="p-3">
                        <span className="bg-red-100 text-red-800 text-xs px-2.5 py-0.5 rounded-full font-medium">Cancelled</span>
                      </td>
                      <td className="p-3 font-semibold text-gray-700">₹900</td>
                      <td className="p-3">Shruti Iyer</td>
                      <td className="p-3">30 Mins</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {open && id && (
        <PerformanceDashboardModal
          id={id}
          onClose={() => {
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading Page...</div>}>
      <AstrologerPopUpContent />
    </Suspense>
  );
}
