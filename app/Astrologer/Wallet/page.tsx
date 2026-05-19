"use client";

import Image from "next/image";

const transactions = [
  {
    title: "Daily Earnings - 26 Mar",
    date: "2026-Mar-30",
    amount: "+₹750",
    type: "credit",
  },
  {
    title: "Withdrawal to Bank",
    date: "2026-Mar-30",
    amount: "-₹750",
    type: "debit",
  },
  {
    title: "Daily Earnings - 26 Mar",
    date: "2026-Mar-30",
    amount: "+₹750",
    type: "credit",
  },
  {
    title: "Withdrawal to Bank",
    date: "2026-Mar-30",
    amount: "-₹750",
    type: "debit",
  },
] as const;

export default function WalletPage() {
  return (
    <main className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Top Section */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* Wallet Card */}
        <section className="rounded-xl bg-gradient-to-r from-[#0180D5] to-[#0040C1] p-5 xl:w-3/4 shadow-md  lg:h-[210px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                Available Balance
              </p>
              <h2 className="mt-2 text-3xl font-bold text-white">₹0</h2>
            </div>

            <Image
              src="/images/bigWallet.png"
              width={55}
              height={55}
              alt="Wallet balance illustration"
            />
          </div>

          <button className="mt-5 h-11 w-full rounded-xl bg-white text-sm font-medium text-[#4898E1] transition hover:bg-gray-100">
            Withdraw Money
          </button>
        </section>

        {/* Right Cards */}
        <div className="flex flex-col w-full gap-4 ">
          {/* This Month */}
          <div className="flex h-[95px] items-center gap-5 rounded-xl border border-gray-300 bg-white px-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-100">
              <Image
                src="/images/leftBottonGreen.png"
                width={14}
                height={14}
                alt="Income icon"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">This Month</p>
              <h3 className="text-lg font-semibold text-black">₹64,540</h3>
            </div>
          </div>

          {/* Withdrawn */}
          <div className="flex h-[95px] items-center gap-5 rounded-xl border border-gray-300 bg-white px-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#4898E1]/10">
              <Image
                src="/images/rightTopBlue.png"
                width={14}
                height={14}
                alt="Withdrawal icon"
              />
            </div>

            <div>
              <p className="text-xs text-gray-500">Withdrawn</p>
              <h3 className="text-lg font-semibold text-black">₹42,500</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <section className="mt-6 rounded-lg bg-yellow-100 p-4">
        <h3 className="text-sm font-semibold text-black">
          Earnings are credited daily
        </h3>

        <p className="mt-2 text-xs text-gray-700">
          Your consultation earnings are automatically credited to your wallet
          at 11:59 PM every day. Minimum withdrawal amount is ₹500.
        </p>
      </section>

      {/* Transaction History */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-black">
          Transaction History
        </h2>

        <div className="mt-5 space-y-4">
          {transactions.map((entry, index) => (
            <article
              key={index}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Image
                    src={
                      entry.type === "credit"
                        ? "/images/leftBottonGreen.png"
                        : "/images/rightTopRed.png"
                    }
                    width={14}
                    height={14}
                    alt={
                      entry.type === "credit"
                        ? "Credit transaction"
                        : "Debit transaction"
                    }
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-black">{entry.title}</h4>
                  <p className="text-xs text-gray-500">{entry.date}</p>
                </div>
              </div>

              <p
                className={`text-lg font-semibold ${
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
