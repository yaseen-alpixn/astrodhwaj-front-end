"use client";

import { useEffect, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import Image from "next/image";

import { formatCurrency, formatDate } from "@/services/api";
import { getWallet, type WalletSummary } from "@/services/user.service";
import { createOrder, verifyPayment, type RazorpayPaymentResult } from "@/services/wallet.service";

type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResult) => void;
  modal?: { ondismiss?: () => void };
};

type RazorpayCheckout = {
  open: () => void;
  on: (event: "payment.failed", callback: (response: { error?: { description?: string } }) => void) => void;
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => RazorpayCheckout;
  }
}

export default function WalletPage() {
  const [wallet, setWallet] = useState<WalletSummary>({ balance: 0, recharge_packs: [], transactions: [] });
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  function loadWallet() {
    setLoading(true);
    getWallet()
      .then((response) => {
        setWallet(response.data);
        setSelectedAmount(response.data.recharge_packs.find((pack) => pack.popular)?.amount || response.data.recharge_packs[0]?.amount || null);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load wallet"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    getWallet()
      .then((response) => {
        setWallet(response.data);
        setSelectedAmount(response.data.recharge_packs.find((pack) => pack.popular)?.amount || response.data.recharge_packs[0]?.amount || null);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load wallet"))
      .finally(() => setLoading(false));
  }, []);

  function loadRazorpay() {
    if (typeof window === "undefined") return Promise.resolve(false);
    if (window.Razorpay) return Promise.resolve(true);
    return new Promise<boolean>((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function addMoney() {
    if (!selectedAmount) return;
    setPaying(true);
    setError("");
    try {
      const order = (await createOrder(selectedAmount)).data;
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) throw new Error("Payment gateway could not load. Please try again.");
      const checkout = new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        name: "Astro Dhwaj",
        description: "Wallet recharge",
        order_id: order.order_id,
        handler: (response) => {
          verifyPayment(response)
            .then(loadWallet)
            .catch((err) => setError(err instanceof Error ? err.message : "Payment verification failed"))
            .finally(() => setPaying(false));
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      checkout.on("payment.failed", (response) => {
        setError(response.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });
      checkout.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Recharge failed");
      setPaying(false);
    }
  }

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

          <h2 className="mt-3 text-3xl font-bold text-black">{formatCurrency(wallet.balance)}</h2>

          <button onClick={addMoney} disabled={paying} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#DD9A29] text-sm font-medium text-white hover:opacity-90">
            <Plus className="h-4 w-4" />
            {paying ? "Opening Payment..." : "Add Money"}
          </button>
        </section>

        {/* Recharge Packs beside card on xl */}
        <section className="xl:flex-1">
          <h3 className="text-lg font-semibold text-black mb-4">
            Recharge Packs
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {loading && <p className="text-sm text-gray-500">Loading...</p>}
            {!loading && error && <p className="text-sm text-red-500">{error}</p>}
            {wallet.recharge_packs.map((pack) => {
              const selected = selectedAmount === pack.amount;
              return (
              <article
                key={pack.amount}
                onClick={() => setSelectedAmount(pack.amount)}
                className={`relative min-h-[100px] rounded-2xl bg-white p-5 shadow-sm ${
                  selected
                    ? "border-2 border-[#DD9A29]"
                    : "border border-gray-200"
                }`}
              >
                {pack.popular && (
                  <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DD9A29] px-3 py-1 text-xs font-medium">
                    Popular
                  </span>
                )}

                <div className="flex h-full flex-col items-center justify-center">
                  <p className="text-lg font-semibold text-[#4898E1]">
                    {formatCurrency(pack.amount)}
                  </p>

                  <span
                    className={`mt-2 rounded-full px-3 py-1 text-xs font-medium ${
                      !pack.bonus
                        ? "text-gray-500"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {pack.bonus ? `+${formatCurrency(pack.bonus)} Bonus` : "No Bonus"}
                  </span>
                </div>
              </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* Transaction History */}
      <section className="mt-10">
        <h3 className="text-lg font-semibold text-black">
          Transaction History
        </h3>

        <div className="mt-5 space-y-4">
          {wallet.transactions.map((entry) => {
            const type = entry.transaction_type.toLowerCase();
            const credit = ["recharge", "refund", "admin_credit"].includes(type);
            return (
            <article
              key={entry.id}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full ${
                    credit ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <Image
                    src={
                      credit
                        ? "/images/upwardArrow.png"
                        : "/images/downwardArrow.png"
                    }
                    width={18}
                    height={18}
                    alt={
                      credit
                        ? "Credit transaction"
                        : "Debit transaction"
                    }
                  />
                </div>

                <div>
                  <p className="font-semibold text-black">{entry.metadata?.details || entry.transaction_type.replace(/_/g, " ")}</p>
                  <p className="text-sm text-gray-500">{formatDate(entry.created_at)}</p>
                </div>
              </div>

              <p
                className={`font-semibold ${
                  credit ? "text-green-600" : "text-red-600"
                }`}
              >
                {credit ? "+" : "-"}{formatCurrency(entry.amount)}
              </p>
            </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
