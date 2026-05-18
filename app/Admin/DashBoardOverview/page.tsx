// app/page.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

import {
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Video,
  MessageCircle,
} from "lucide-react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  const stats = [
    {
      title: "Total Users",
      value: "12,548",
      change: "+12",
      positive: true,
      src: "/images/twoUsers.png",
    },
    {
      title: "Astrologer",
      value: "189",
      change: "+12.5 Active",
      positive: true,

      src: "/images/twoStar.png",
    },
    {
      title: "Live Streams",
      value: "24",
      change: "+12.5",
      positive: true,
      src: "/images/twoServer.png",
    },
    {
      title: "Revenue",
      value: "₹4,85,320",
      change: "+12.5 Today",
      positive: true,
      src: "/images/twoWallet.png",
    },
    {
      title: "Withdrawals",
      value: "₹2,45,000",
      change: "-2.5 Pending",
      positive: false,
      src: "/images/twoWithdraw (1).png",
    },
  ];

  const bars = [
    10, 18, 12, 30, 14, 46, 25, 36, 14, 46, 70, 40, 58, 12, 40, 58, 64, 40, 58,
    28, 46,
  ];

  const revenue = [
    ["Monday", 80],
    ["Tuesday", 90],
    ["Wednesday", 58],
    ["Thursday", 30],
    ["Friday", 68],
    ["Saturday", 12],
  ];

  const growth = [
    ["January", 60],
    ["February", 82],
    ["March", 42],
    ["April", 67],
    ["May", 90],
    ["June", 48],
  ];

  const sessions = [
    {
      type: "Audio Call",
      color: "bg-blue-100 text-blue-700",
      icon: <Phone size={12} />,
    },
    {
      type: "Video Call",
      color: "bg-green-100 text-green-700",
      icon: <Video size={12} />,
    },
    {
      type: "Audio Call",
      color: "bg-blue-100 text-blue-700",
      icon: <Phone size={12} />,
    },
    {
      type: "Chat",
      color: "bg-yellow-100 text-yellow-700",
      icon: <MessageCircle size={12} />,
    },
    {
      type: "Audio Call",
      color: "bg-blue-100 text-blue-700",
      icon: <Phone size={12} />,
    },
    {
      type: "Video Call",
      color: "bg-green-100 text-green-700",
      icon: <Video size={12} />,
    },
  ];

  const transactions = [
    { name: "Rahul Kumar", amount: "+₹1000", positive: true },
    { name: "Pandit Rajesh", amount: "-₹5000", positive: false },
    { name: "Rahul Kumar", amount: "+₹1000", positive: true },
    { name: "Pandit Rajesh", amount: "-₹5000", positive: false },
    { name: "Rahul Kumar", amount: "+₹1000", positive: true },
    { name: "Pandit Rajesh", amount: "-₹5000", positive: false },
  ];

  return (
    <>
      <AdminTopHeader />
      <main className="min-h-screen py-8 pl-5 pr-2 bg-white  font-sans">
        <div className="max-w-[1500px] mx-auto space-y-5">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[28px] font-semibold ">Dashboard Overview</p>
              <p className="text-[14px] font-medium text-gray-500">
                Welcome back! Here&apos;s what&apos;s happening today.
              </p>
            </div>

            <button className="flex h-[42px] w-full items-center justify-center rounded-lg border gap-1 shadow-sm bg-[#4898E1]/10 p-[18px] text-[14px] font-medium md:w-[170px]">
              Last 7 Days <ChevronDown size={18} />
            </button>
          </div>

          {/* Five Cards Same Line */}
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-white  rounded-2xl p-3 h-[130px] shadow-sm  w-full min-w-0 flex flex-col justify-between"
              >
                <div className="flex items-center  gap-3">
                  <div className="w-[40px] h-[40px] shrink-0 rounded-lg text-[#E8F4FF] bg-[#E8F4FF] flex items-center justify-center">
                    <Image
                      src={item.src}
                      width={15}
                      height={15}
                      alt={item.title + " icon"}
                      className="object-cover text-[#005DB2]"
                    />
                  </div>

                  <p className="text-[14px] font-medium whitespace-nowrap ">
                    {item.title}
                  </p>
                </div>

                <div>
                  <h3 className="text-[20px] font-medium truncate">
                    {item.value}
                  </h3>

                  <div
                    className={`mt-1 text-[14px] flex items-center gap-1 font-medium ${
                      item.positive ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.positive ? (
                      <Image
                        src="/images/upwardArrow.png"
                        width={10}
                        height={10}
                        alt="Upward trend arrow"
                        className="object-cover"
                      />
                    ) : (
                      <Image
                        src="/images/downwardArrow.png"
                        width={10}
                        height={10}
                        alt="Downward trend arrow"
                        className="object-cover"
                      />
                    )}

                    <span className="truncate">{item.change}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex justify-between">
              <div>
                <h2 className="text-[20px] font-semibold">
                  24-Hour Activity Distribution
                </h2>
                <p className="text-[14px] font-medium text-gray-500 mt-1">
                  Hourly session patterns across all services
                </p>
              </div>

              <button className="w-[130px] h-[42px] rounded-lg border bg-white p-[18px] flex items-center  shadow-sm justify-center gap-1 text-[14px] font-medium">
                Audio Call <ChevronDown size={18} />
              </button>
            </div>

            <div className="mt-8 h-[180px] flex items-end gap-2">
              {bars.map((bar, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-xs bg-gradient-to-b from-[#4898E1] to-[#005DB2]"
                  style={{ height: `${bar * 2.4}px` }}
                />
              ))}
            </div>

            <div className="flex justify-between font-medium text-[14px] text-gray-500 mt-4">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>23:00</span>
            </div>
          </div>

          {/* Revenue + Growth */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Revenue */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">
                    Revenue Overview
                  </h2>
                  <p className="text-[14px] font-medium text-gray-500 mt-2">
                    Daily revenue for the last 7 days
                  </p>
                </div>

                <Link href="/Admin/WalletTransaction">
                  <button className="text-[16px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {revenue.map(([day, width], i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-[15px] font-medium">
                        {day}
                        <span className="text-gray-400 font-normal">
                          {" "}
                          • 145 Users
                        </span>
                      </p>

                      <p className="text-[16px] font-semibold">₹67K</p>
                    </div>

                    <div className="h-[9px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4898E1] rounded-full"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth */}
            <div className="bg-white  rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">User Growth</h2>
                  <p className="text-[14px] font-medium whitespace-nowrap text-gray-500 mt-2">
                    Monthly user registrations (last 6 months)
                  </p>
                </div>

                <Link href="/Admin/UserManagement">
                  <button className="text-[16px] whitespace-nowrap font-medium text-[#4898E1] text-start">
                    Manage Users
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {growth.map(([month, width], i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <p className="text-[15px] font-medium">{month}</p>
                      <p className="text-[16px] font-semibold">8,420 Users</p>
                    </div>

                    <div className="h-[9px] bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Two Boxes */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Sessions */}
            <div className="bg-white  rounded-2xl p-5 shadow-sm">
              <div className="flex itmes-start justify-between">
                <div>
                  <h2 className="text-[20px] font-semibold">Active Sessions</h2>
                  <p className="text-[16px] font-normal text-gray-500 mt-2">
                    6 ongoing consultations
                  </p>
                </div>

                <Link href="/Admin/LiveSession">
                  <button className="text-[17px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {sessions.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] text-[#4898E1] flex items-center justify-center text-[14px] font-medium">
                        PS
                      </div>

                      <div>
                        <h4 className="text-[15px] font-medium">
                          Dr. Priya Sharma
                        </h4>
                        <p className="text-[15px]  text-gray-500">
                          With Rahul Kumar
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full inline-flex gap-1 items-center text-[14px] font-medium ${item.color}`}
                      >
                        {item.icon}
                        {item.type}
                      </span>

                      <p className="text-[12px] font-normal text-gray-500 mt-2">
                        10:00 AM - 3:00 PM • ₹562
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transactions */}
            <div className="bg-white  rounded-2xl p-5  shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-[22px] font-semibold">
                    Recent Transactions
                  </h2>
                  <p className="text-[15px] font-medium text-gray-500">
                    Latest financial activities
                  </p>
                </div>

                <Link href="/Admin/WalletTransaction">
                  <button className="text-[16px] font-medium text-[#4898E1]">
                    View All
                  </button>
                </Link>
              </div>

              <div className="mt-6 space-y-5">
                {transactions.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center ${
                          item.positive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.positive ? (
                          <ArrowDownRight size={16} />
                        ) : (
                          <ArrowUpRight size={16} />
                        )}
                      </div>

                      <div>
                        <h4 className="text-[15px] font-medium">{item.name}</h4>
                        <p className="text-[16px] text-gray-500">
                          Recharge • TXN001
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <h4
                        className={`text-[18px] font-medium ${
                          item.positive ? "text-green-600" : "text-red-500"
                        }`}
                      >
                        {item.amount}
                      </h4>

                      <p className="text-[14px] font-normal  text-gray-500 mt-1">
                        Completed
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
