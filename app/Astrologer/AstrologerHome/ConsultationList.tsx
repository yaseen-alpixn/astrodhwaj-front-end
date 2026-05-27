"use client";

import { CalendarDays } from "lucide-react";
import RecentReviews from "./RecentReviews";
import { formatCurrency } from "@/services/api";
import type { AstrologerDashboard } from "@/services/astrologer.service";

type ConsultationListProps = {
  schedule: AstrologerDashboard["schedule"];
  reviews: AstrologerDashboard["recent_reviews"];
};

export default function ConsultationList({ schedule, reviews }: ConsultationListProps) {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start w-full">
      <div className="w-full">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-[18px] h-[20px] text-[#4898E1]" />
          <h2 className="text-[18px] font-semibold leading-[100%] capitalize">
            Today&apos;s Schedule
          </h2>
        </div>

        {/* List */}
        <div className="flex flex-col gap-[15px]">
          {schedule.map((item, i) => (
            <div
              key={item.id || i}
              className="h-[117px] w-full rounded-[15px] bg-white shadow-sm p-[15px] flex items-center justify-between lg:max-w-[770px]"
            >
              {/* LEFT */}
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#0180D5] to-[#0040C1] flex items-center justify-center text-white font-medium">
                  {(item.metadata?.user_name || "US").slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex flex-col gap-2">
                  {/* Name */}
                  <h3 className="text-[16px] font-semibold leading-[100%] capitalize">
                    {item.metadata?.user_name || "User"}
                  </h3>

                  {/* Time */}
                  <p className="text-[12px] font-normal leading-[100%] text-gray-600 capitalize">
                    {item.booking_time || "10:30 AM"} | {item.duration || 30} Min
                  </p>

                  {/* Tags */}
                  <div className="flex gap-2">
                    {/* Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-medium capitalize
                    ${
                      item.status === "confirmed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                    >
                      {item.status}
                    </span>

                    {/* Type */}
                    <span className="px-3 py-1 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 capitalize">
                      {item.consultation_mode.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT AMOUNT */}
              <div className="text-[#4898E1] text-[16px] font-semibold">
                {formatCurrency(item.amount)}
              </div>
            </div>
          ))}
          {schedule.length === 0 && <p className="text-[12px] font-normal leading-[100%] text-gray-600 capitalize">No bookings found</p>}
        </div>
      </div>
      <RecentReviews reviews={reviews} />
    </div>
  );
}
