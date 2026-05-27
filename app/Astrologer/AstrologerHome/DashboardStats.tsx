"use client";

import Image from "next/image";
import { Phone, MessageCircle, Video, Star } from "lucide-react";
import { formatCurrency } from "@/services/api";

type DashboardStatsProps = {
  stats?: Record<string, number>;
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const sessions = [
    {
      icon: <Phone className="w-5 h-5 text-green-500" />,
      title: String(stats?.call_sessions || 0),
      subtitle: "Call Sessions",
    },
    {
      icon: <MessageCircle className="w-5 h-5 text-pink-500" />,
      title: String(stats?.chat_sessions || 0),
      subtitle: "Chat Sessions",
    },
    {
      icon: <Video className="w-5 h-5 text-orange-500" />,
      title: String(stats?.video_sessions || 0),
      subtitle: "Video Sessions",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-[#4898E1]" />
        <h2 className="text-[18px] font-semibold">My Earnings</h2>
      </div>

      {/* Top Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Total Consultations */}
        <div className="flex-1 min-h-[108px] bg-white rounded-[15px] shadow-sm p-4 flex items-center gap-4">
          <Image
            src="/images/twoWithdraw (3).png"
            width={22}
            height={22}
            alt="Total consultations icon"
          />

          <div>
            <p className="text-[20px] font-bold text-[#4898E1]">{stats?.total_consultations || 0}</p>
            <p className="text-[12px] text-gray-500">Total Consultations</p>
          </div>
        </div>

        {/* Sessions */}
        <div className="flex-[2] grid grid-cols-1 sm:grid-cols-3 gap-4">
          {sessions.map((card, i) => (
            <div
              key={i}
              className="min-h-[108px] bg-white rounded-[15px] shadow-sm flex flex-col items-center justify-center px-4"
            >
              {card.icon}

              <p className="text-[16px] text-[#0180D5] font-semibold mt-2">
                {card.title}
              </p>

              <p className="text-[12px] text-[#0180D5]mt-1 text-center">
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Earnings Card */}
        <div className="flex-1 min-h-[108px] bg-white rounded-[15px] shadow-sm p-4 flex items-center gap-4">
          <Image
            src="/images/twoEarnings.png"
            width={22}
            height={22}
            alt="Total earnings icon"
          />

          <div>
            <p className="text-[20px] font-bold text-[#4898E1]">{formatCurrency(stats?.total_earnings || 0)}</p>
            <p className="text-[12px] text-gray-500">Total Earnings</p>
          </div>
        </div>

        {/* Average Card */}
        <div className="flex-[2] min-h-[108px] rounded-[15px] p-5 relative overflow-hidden bg-gradient-to-b from-[#0180D5] to-[#DD9A29] text-white">
          <p className="text-[12px]">Average Per Session</p>

          <p className="text-[20px] font-bold mt-2">{formatCurrency(stats?.average_per_session || 0)}</p>

          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[62px] opacity-75 mix-blend-overlay">
            INR
          </span>
        </div>
      </div>
    </div>
  );
}
