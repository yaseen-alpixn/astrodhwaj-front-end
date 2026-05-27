"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { formatCurrency, formatDate } from "@/services/api";
import { addBankAccount, getWallet, requestWithdrawal, type AstrologerWallet } from "@/services/astrologer.service";

export default function WalletPage() {
  const [wallet, setWallet] = useState<AstrologerWallet>({ balance: 0, this_month: 0, withdrawn: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [holderName, setHolderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [confirmAccountNumber, setConfirmAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [upiId, setUpiId] = useState("");
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);

  const fetchWallet = () => {
    setLoading(true);
    getWallet()
      .then((response) => setWallet(response.data))
      .catch(() => undefined)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWithdrawError("Please enter a valid amount.");
      return;
    }
    if (amount < 1500) {
      setWithdrawError("Minimum withdrawal amount is INR 1500.");
      return;
    }
    if (amount > wallet.balance) {
      setWithdrawError("Insufficient balance.");
      return;
    }
    if (!holderName.trim() || (!upiId.trim() && (!bankName.trim() || !accountNumber.trim() || !confirmAccountNumber.trim() || !ifscCode.trim()))) {
      setWithdrawError("Enter UPI ID or complete bank account details.");
      return;
    }
    if (accountNumber && accountNumber !== confirmAccountNumber) {
      setWithdrawError("Account numbers do not match.");
      return;
    }
    if (ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(ifscCode.trim())) {
      setWithdrawError("Enter a valid IFSC code.");
      return;
    }
    if (upiId && !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9.\-_]{2,64}$/.test(upiId.trim())) {
      setWithdrawError("Enter a valid UPI ID.");
      return;
    }
    setWithdrawing(true);
    setWithdrawError("");
    setWithdrawSuccess("");
    try {
      const account = await addBankAccount({
        holder_name: holderName,
        bank_name: bankName || undefined,
        account_number: accountNumber || undefined,
        confirm_account_number: confirmAccountNumber || undefined,
        ifsc_code: ifscCode || undefined,
        upi_id: upiId || undefined,
        is_primary: true,
      });
      const bankId = (account.data as { id?: string })?.id;
      await requestWithdrawal(amount, bankId, `wd_${Date.now()}`);
      setWithdrawSuccess("Withdrawal request submitted successfully!");
      // Refresh wallet
      const response = await getWallet();
      setWallet(response.data);
      setTimeout(() => setShowWithdrawModal(false), 1500);
    } catch (err: unknown) {
      setWithdrawError(err instanceof Error ? err.message : "Failed to submit request.");
    } finally {
      setWithdrawing(false);
    }
  };

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
              <h2 className="mt-2 text-3xl font-bold text-white">{formatCurrency(wallet.balance)}</h2>
            </div>

            <Image
              src="/images/bigWallet.png"
              width={55}
              height={55}
              alt="Wallet balance illustration"
            />
          </div>

          <button 
            onClick={() => {
              setWithdrawAmount("");
              setWithdrawError("");
              setWithdrawSuccess("");
              setShowWithdrawModal(true);
            }}
            className="mt-5 h-11 w-full rounded-xl bg-white text-sm font-medium text-[#4898E1] transition hover:bg-gray-100"
          >
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
              <h3 className="text-lg font-semibold text-black">{formatCurrency(wallet.this_month)}</h3>
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
              <h3 className="text-lg font-semibold text-black">{formatCurrency(wallet.withdrawn)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <section className="mt-6 rounded-lg bg-yellow-100 p-4">
        <h3 className="text-sm font-semibold text-black">
          Earnings are credited daily
        </h3>

        <p className="hidden">
          Your consultation earnings are automatically credited to your wallet
          at 11:59 PM every day. Minimum withdrawal amount is INR 1500.
        </p>
        <p className="mt-2 text-xs text-gray-700">
          Your consultation earnings are automatically credited to your wallet at 11:59 PM every day. Minimum withdrawal amount is INR 1500.
        </p>
      </section>

      {/* Transaction History */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold text-black">
          Transaction History
        </h2>

        <div className="mt-5 space-y-4">
          {loading && <p className="text-xs text-gray-500">Loading...</p>}
          {wallet.transactions.map((entry) => {
            const credit = entry.transaction_type !== "withdrawal";
            return (
            <article
              key={entry.id}
              className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Image
                    src={
                      credit
                        ? "/images/leftBottonGreen.png"
                        : "/images/rightTopRed.png"
                    }
                    width={14}
                    height={14}
                    alt={
                      credit
                        ? "Credit transaction"
                        : "Debit transaction"
                    }
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-black">{entry.transaction_type.replace(/_/g, " ")}</h4>
                  <p className="text-xs text-gray-500">{formatDate(entry.created_at)}</p>
                </div>
              </div>

              <p
                className={`text-lg font-semibold ${
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
      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-black">Withdraw Money</h3>
            <p className="hidden">
              Minimum withdrawal amount is INR 1500. Balance is processed to your registered bank account.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Minimum withdrawal amount is INR 1500. Balance is processed to your bank account or UPI ID.
            </p>
            
            <form onSubmit={handleWithdrawSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Amount (INR)
                </label>
                <label className="hidden">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="1500"
                  step="any"
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                  placeholder="Enter amount (e.g. 1500)"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                  placeholder="Enter account holder name"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                    placeholder="Bank name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                    placeholder="HDFC0001234"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Account Number
                  </label>
                  <input
                    type="password"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                    placeholder="Account number"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase">
                    Confirm Account
                  </label>
                  <input
                    type="password"
                    value={confirmAccountNumber}
                    onChange={(e) => setConfirmAccountNumber(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                    placeholder="Confirm account"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  UPI ID
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-black outline-none focus:border-[#4898E1]"
                  placeholder="name@upi"
                />
                <p className="mt-1 text-[11px] text-gray-500">
                  Enter UPI ID or complete bank details.
                </p>
              </div>

              {withdrawError && (
                <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-200">
                  {withdrawError}
                </div>
              )}

              {withdrawSuccess && (
                <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-600 border border-green-200">
                  {withdrawSuccess}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={withdrawing}
                  className="rounded-xl bg-[#0040C1] px-4 py-2 text-sm font-bold text-white shadow-md hover:bg-[#0180D5] disabled:opacity-50"
                >
                  {withdrawing ? "Processing..." : "Withdraw"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
