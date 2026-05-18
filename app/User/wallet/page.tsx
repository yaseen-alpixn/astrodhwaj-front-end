"use client";

import { Plus, Wallet } from "lucide-react";
import Image from "next/image";

const rechargePacks = [
  { amount: "₹100", bonus: "No Bonus", isPopular: false, selected: false },
  { amount: "₹500", bonus: "+₹50 Bonus", isPopular: true, selected: true },
  { amount: "₹1000", bonus: "+₹150 Bonus", isPopular: false, selected: false },
  { amount: "₹2000", bonus: "+₹250 Bonus", isPopular: false, selected: false },
];

const transactions = [
  {
    title: "Welcome Bonus",
    date: "2026-03-30",
    amount: "+₹500",
    type: "credit",
  },
  {
    title: "Tarot Reading",
    date: "2026-03-30",
    amount: "-₹250",
    type: "debit",
  },
  {
    title: "Welcome Bonus",
    date: "2026-03-30",
    amount: "+₹500",
    type: "credit",
  },
  {
    title: "Tarot Reading",
    date: "2026-03-30",
    amount: "-₹250",
    type: "debit",
  },
] as const;

export default function WalletPage() {
  return (
    <main className="bg-white px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* Balance Card */}
        <section className="rounded-xl bg-[#E1F4FF] p-5 shadow-sm xl:flex-[1.2] xl:mt-12 xl:p-10">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-black">
            <Wallet className="h-4 w-4" />
            Current Balance
          </p>

          <h2 className="mt-3 text-3xl font-bold text-black">₹500</h2>

          <button className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#DD9A29] text-sm font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
            Add Money
          </button>
        </section>

        {/* Recharge Packs beside card on xl */}
        <section className="xl:flex-1">
          <h3 className="text-lg font-semibold text-black mb-4">
            Recharge Packs
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {rechargePacks.map((pack) => (
              <article
                key={pack.amount}
                className={`relative min-h-[100px] rounded-2xl bg-white p-5 shadow-sm ${
                  pack.selected
                    ? "border-2 border-[#DD9A29]"
                    : "border border-gray-200"
                }`}
              >
                {pack.isPopular && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DD9A29] px-3 py-1 text-xs font-medium">
                    Popular
                  </span>
                )}

                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-lg font-semibold text-[#4898E1]">
                    {pack.amount}
                  </p>

                  <span
                    className={`mt-2 rounded-full px-3 py-1 text-xs font-medium ${
                      pack.bonus === "No Bonus"
                        ? "text-gray-500"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {pack.bonus}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Transaction History */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold text-black">
          Transaction History
        </h3>

        <div className="mt-5 space-y-4">
          {transactions.map((entry, index) => (
            <article
              key={index}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    entry.type === "credit" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Image
                    src={
                      entry.type === "credit"
                        ? "/images/upwardArrow.png"
                        : "/images/downwardArrow.png"
                    }
                    width={18}
                    height={18}
                    alt={
                      entry.type === "credit"
                        ? "Credit transaction"
                        : "Debit transaction"
                    }
                  />
                </div>

                <div>
                  <p className="font-semibold text-black">{entry.title}</p>
                  <p className="text-sm text-gray-500">{entry.date}</p>
                </div>
              </div>

              <p
                className={`font-semibold ${
                  entry.type === "credit" ? "text-green-600" : "text-red-600"
                }`}
              >
                {entry.amount}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
