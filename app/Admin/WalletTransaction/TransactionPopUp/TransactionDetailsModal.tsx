"use client";

import { ArrowDownLeft, X } from "lucide-react";

export default function TransactionDetailsModal({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-[min(1000px,95vw)] overflow-y-auto rounded-xl bg-white p-4 font-[DM_Sans] md:p-6">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-4">
          <h1 className="text-[26px] font-semibold">Transaction Details</h1>
          <button className="text-xl" onClick={onClose}>
            <X />
          </button>
        </div>

        {/* TOP CARD */}
        <div className="mt-5 rounded-xl bg-green-600 p-5 text-white">
          <div className="flex items-center justify-between">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <ArrowDownLeft />
              </div>
              <div>
                <p className="text-lg font-semibold">Recharge</p>
                <p className="text-sm opacity-80">ORD2603001</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="text-right">
              <p className="text-sm opacity-80">Amount</p>
              <p className="text-2xl font-semibold">₹500</p>
            </div>
          </div>

          {/* INFO ROW */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Status", value: "Completed" },
              { label: "Method", value: "UPI" },
              { label: "Date & Time", value: "26 Mar, 2:30 PM" },
            ].map((item, i) => (
              <div key={i} className="rounded-lg bg-white/20 p-3">
                <p className="text-sm opacity-80">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* BALANCE FLOW */}
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-4 text-lg font-semibold">Balance Flow</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-purple-400 bg-purple-100 p-5 text-center">
              <p className="text-sm text-gray-600">Previous Balance</p>
              <p className="text-2xl font-semibold text-purple-700">₹2000</p>
            </div>

            <div className="rounded-xl border border-green-500 bg-green-100 p-5 text-center">
              <p className="text-sm text-gray-600">New Balance</p>
              <p className="text-2xl font-semibold text-green-700">₹2500</p>
            </div>
          </div>
        </div>

        {/* USER INFO */}
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-4 text-lg font-semibold">User Information</h2>

          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Name", value: "Rahul Kumar" },
              { label: "User ID", value: "USR001" },
              { label: "Phone", value: "+91 9876543210" },
              { label: "Email ID", value: "rahul.k@email.com" },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-gray-500">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TRANSACTION INFO */}
        <div className="mt-6 rounded-xl border p-4">
          <h2 className="mb-4 text-lg font-semibold">Transaction Details</h2>

          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            {[
              { label: "Transaction ID", value: "TXN2603001" },
              { label: "Order ID", value: "ORD2603001" },
              { label: "Payment Gateway", value: "Razorpay" },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-gray-500">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
