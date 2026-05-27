"use client";

import { useState } from "react";
import {
  Phone,
  Wallet,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CircleDollarSign,
  TrendingUp,
} from "lucide-react";
import { adminApi, formatDate, formatCurrency } from "../../api";

type TransactionRecord = {
  id?: string;
  transaction_type?: string;
  method?: string;
  status?: string;
  amount?: number;
  created_at?: string;
};

export type UserDetail = {
  id?: string;
  _id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  status?: string;
  created_at?: string;
  last_login_at?: string;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  total_sessions?: number;
  total_spent?: number;
  wallet_balance?: number;
  transactions?: TransactionRecord[];
};

type UserSectionsProps = {
  user: UserDetail;
  onUserUpdate?: (user: Partial<UserDetail>) => void;
};

export default function UserSections({ user, onUserUpdate }: UserSectionsProps) {
  const [creditedBalance, setCreditedBalance] = useState<number | null>(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [creditMessage, setCreditMessage] = useState("");

  // Extract and format recent transaction lists from DB
  const recentTransactions = user.transactions || [];
  const walletBalance = creditedBalance ?? user.wallet_balance ?? 0;

  const addWalletCredit = () => {
    const amount = Number(creditAmount);
    const userId = user.id || user._id;
    if (!userId) {
      setCreditMessage("User id is missing");
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setCreditMessage("Enter a valid amount greater than zero");
      return;
    }
    adminApi<{ balance: number }>(`/admin/users/${userId}/wallet-credit`, {
      method: "POST",
      body: JSON.stringify({ amount, reason: creditReason || "Admin wallet credit" }),
    })
      .then((response) => {
        setCreditedBalance(response.data.balance);
        onUserUpdate?.({ wallet_balance: response.data.balance });
        setCreditAmount("");
        setCreditReason("");
        setCreditMessage("Wallet credited successfully");
      })
      .catch((err) => setCreditMessage(err instanceof Error ? err.message : "Wallet credit failed"));
  };

  return (
    <div className="space-y-6">
      
      {/* Contact & Birth Details (astrology specific) */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h2 className="text-[18px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
          <Calendar size={18} className="text-[#4898E1]" />
          Astrology & Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <Mail size={18} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Email Address</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{user.email}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <Phone size={18} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Phone Number</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{user.phone || "Not Provided"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <Calendar size={18} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Date of Birth</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{user.date_of_birth || "Not Specified"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <Clock size={18} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Time of Birth</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{user.time_of_birth || "Not Specified"}</p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3 md:col-span-2 lg:col-span-1">
            <MapPin size={18} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-gray-400 uppercase">Place of Birth</p>
              <p className="text-xs font-semibold text-gray-800 truncate">{user.place_of_birth || "Not Specified"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Performance Metrics */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h2 className="text-[18px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
          <TrendingUp size={18} className="text-green-500" />
          Platform Usage Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Sessions</p>
            <p className="text-2xl font-extrabold text-gray-850 mt-1">{user.total_sessions || 0}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">consultations completed</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
            <p className="text-xs font-bold text-gray-400 uppercase">Total Spending</p>
            <p className="text-2xl font-extrabold text-green-600 mt-1">{formatCurrency(user.total_spent || 0)}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">spent on services</p>
          </div>

          <div className="border border-gray-100 rounded-xl p-4 text-center bg-gray-50/50">
            <p className="text-xs font-bold text-gray-400 uppercase">Wallet Balance</p>
            <p className="text-2xl font-extrabold text-[#4898E1] mt-1">{formatCurrency(walletBalance)}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">available credits</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 md:grid-cols-[160px_1fr_auto]">
          <input
            type="number"
            min="1"
            value={creditAmount}
            onChange={(event) => setCreditAmount(event.target.value)}
            placeholder="Amount"
            className="h-10 rounded-lg border px-3 text-sm"
          />
          <input
            value={creditReason}
            onChange={(event) => setCreditReason(event.target.value)}
            placeholder="Reason for admin credit"
            className="h-10 rounded-lg border px-3 text-sm"
          />
          <button onClick={addWalletCredit} className="rounded-lg bg-[#4898E1] px-4 py-2 text-sm font-semibold text-white">
            Add Money
          </button>
          {creditMessage && <p className="text-xs font-semibold text-gray-500 md:col-span-3">{creditMessage}</p>}
        </div>
      </div>

      {/* Dynamic Wallet Transactions (linked to database) */}
      <div className="border rounded-xl p-5 bg-white shadow-sm">
        <h2 className="text-[18px] font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
          <Wallet size={18} className="text-purple-500" />
          Recent Transaction History
        </h2>

        {recentTransactions.length === 0 ? (
          <div className="text-center py-6 text-xs font-bold text-gray-400 uppercase">
            No transactions registered for this user
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.slice(0, 5).map((tx, i) => (
              <div
                key={tx.id || i}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100/50 transition p-3.5 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    tx.transaction_type === "recharge"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}>
                    {tx.transaction_type === "recharge" ? (
                      <CircleDollarSign size={16} />
                    ) : (
                      <Wallet size={16} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-xs text-gray-800 truncate">
                      {tx.transaction_type ? tx.transaction_type.toUpperCase().replace("_", " ") : "TRANSACTION"}
                    </p>
                    <p className="text-[10px] font-semibold text-gray-400 mt-0.5">
                      {formatDate(tx.created_at)} • {tx.method || "INTERNAL"}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`font-extrabold text-sm ${
                    tx.transaction_type === "recharge" ? "text-green-600" : "text-purple-600"
                  }`}>
                    {tx.transaction_type === "recharge" ? "+" : "-"}{formatCurrency(tx.amount || 0)}
                  </p>
                  <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    tx.status === "completed" || tx.status === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                  }`}>
                    {tx.status ? tx.status.toUpperCase() : "COMPLETED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
