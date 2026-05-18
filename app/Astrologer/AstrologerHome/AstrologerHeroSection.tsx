"use client";

import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";
import DashboardStats from "./DashboardStats";

const stats = [
  {
    src: "/images/User.png",
    value: "8",
    label: "Consultations Today",
  },
  {
    src: "/images/Earning.png",
    value: "₹6250",
    label: "Today's Earnings",
  },
  {
    src: "/images/Star.png",
    value: "4.8",
    label: "Ratings",
  },
  {
    src: "/images/Wallet.png",
    value: "₹0",
    label: "Wallet Balance",
  },
];

export default function AstrologerHeroSection() {
  return (
    <div className="w-full flex flex-col gap-6 xl:flex-row xl:items-stretch">
      {/* LEFT SIDE */}
      <div className="w-full xl:w-1/2 flex flex-col sm:flex-row gap-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1">
          {stats.map((item, i) => (
            <div
              key={i}
              className="min-h-[110px] rounded-[15px] bg-white p-4 shadow-sm flex flex-col justify-between"
            >
              <Image
                src={item.src}
                width={20}
                height={20}
                alt={item.label + " icon"}
                className="object-cover"
              />

              <div>
                <h2 className="text-[20px] font-bold text-pink-700">
                  {item.value}
                </h2>
                <p className="text-[12px] text-gray-600 leading-tight">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Live Card */}
        <div className="flex-1 min-h-[235px] rounded-[15px] p-6 flex flex-col justify-between bg-gradient-to-r from-pink-600 to-purple-700 text-white relative overflow-hidden">
          <Radio className="w-7 h-7" />

          <div>
            <h2 className="text-[18px] font-semibold mb-2">
              Start Live Session
            </h2>

            <p className="text-[13px] leading-[22px] opacity-90">
              Go live and reach thousands of users instantly. Share your
              knowledge and earn more!
            </p>
          </div>

          <Link href="/Astrologer/LiveSessions">
            <button className="w-full h-[50px] rounded-[10px] bg-white text-purple-700 text-[13px] font-medium hover:bg-gray-100 transition">
              Go Live
            </button>
          </Link>

          <div className="absolute right-[-40px] top-[-40px] w-[150px] h-[150px] bg-white/10 rounded-full" />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/2 min-w-0">
        <DashboardStats />
      </div>
    </div>
  );
}
