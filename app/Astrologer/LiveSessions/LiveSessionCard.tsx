"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import StatsGrid from "./StatsGrid";
export default function LiveSessionCard() {
  return (
    <div className="flex flex-col gap-6 xl:gap-25 xl:flex-row xl:items-start w-full">
      <div
        className="mt-4  w-full rounded-[15px] p-[15px] lg:max-w-[790px]
    bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 text-white space-y-5 relative overflow-hidden"
      >
        {/* Icon */}
        <Radio className="w-[25px] h-[18px]" />

        {/* Title */}
        <h2 className="font-[DM_Sans] text-[18px] font-semibold capitalize">
          Start Live Session
        </h2>

        {/* Description */}
        <p className="font-[DM_Sans] font-normal text-[13px] leading-[22px] capitalize lg:max-w-[600px]">
          Share your knowledge with thousands of users in real-time. Earn while
          you teach!
        </p>

        {/* 3 Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { value: "5000+", label: "Reach" },
            { value: "₹2000+", label: "Per Hour" },
            { value: "24/7", label: "Anytime" },
          ].map((item, i) => (
            <div
              key={i}
              className="h-[57px] rounded-[10px] bg-white/20 backdrop-blur p-[10px] flex flex-col items-center justify-center"
            >
              <p className="font-[DM_Sans] font-semibold text-[16px] text-center">
                {item.value}
              </p>
              <p className="font-[DM_Sans] text-[11px] font-medium text-center opacity-90">
                {item.label}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <Link href="/Astrologer/LiveSessions">
          <button className="w-full h-[51px] rounded-[10px] bg-white text-purple-700 text-[13px] font-medium">
            Go Live Now ▶
          </button>
        </Link>

        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-white/10 rounded-full"></div>
      </div>
      <StatsGrid />
    </div>
  );
}
