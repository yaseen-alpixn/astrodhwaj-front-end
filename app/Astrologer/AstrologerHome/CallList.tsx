"use client";

import { Phone, Video } from "lucide-react";

const data = [
  {
    name: "Rahul Kumar",
    type: "call",
    date: "26 Mar, 10:30 AM",
    duration: "30 Min",
    amount: "+750",
  },
  {
    name: "Rahul Kumar",
    type: "video",
    date: "26 Mar, 10:30 AM",
    duration: "30 Min",
    amount: "+750",
  },
  {
    name: "Rahul Kumar",
    type: "video",
    date: "26 Mar, 10:30 AM",
    duration: "30 Min",
    amount: "+750",
  },
  {
    name: "Rahul Kumar",
    type: "call",
    date: "26 Mar, 10:30 AM",
    duration: "30 Min",
    amount: "+750",
  },
];

export default function CallList() {
  return (
    <div className="w-full rounded-2xl bg-white p-4 shadow-md space-y-4 lg:max-w-[770px] ">
      {/* Heading */}
      <div className="flex justify-between items-center h-[26px] opacity-100">
        <h2 className="text-[18px] font-semibold font-[DM_Sans] capitalize">
          Recent Transactions
        </h2>
        <button className="text-[#4898E1] text-[12px] font-medium">
          Filter
        </button>
      </div>

      {/* List */}
      {data.map((item, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
        >
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="w-[55px] h-[55px] pt-[12px] pr-[21px] pb-[12px] pl-[21px] rounded-full bg-gradient-to-r from-yellow-100 to-[#4898E1]/10 flex items-center justify-center">
              {item.type === "call" ? (
                <Phone className="text-[#4898E1] w-12 h-12" />
              ) : (
                <Video className="text-[#4898E1] w-12 h-12" />
              )}
            </div>

            {/* Name + Date */}
            <div>
              {/* Name */}
              <p className="font-[DM_Sans] text-[16px] font-semibold leading-[100%] capitalize">
                {item.name}
              </p>

              {/* Date & Duration */}
              <p className="font-[DM_Sans] text-[12px] font-normal leading-[100%] capitalize text-gray-500 mt-1">
                {item.date}
              </p>
              <p className="font-[DM_Sans] text-[12px] font-normal leading-[100%] capitalize text-gray-500">
                {item.duration}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="font-[DM_Sans] text-[16px] font-semibold leading-[100%] text-right text-green-600 capitalize">
            {item.amount}
          </div>
        </div>
      ))}
    </div>
  );
}
