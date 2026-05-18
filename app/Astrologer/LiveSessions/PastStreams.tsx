import { Clock, Eye } from "lucide-react";

export default function PastStreams() {
  const data = [1, 2, 3];

  return (
    <div className="mx-auto w-full space-y-4 xl:w-full">
      {/* Heading */}
      <h2 className="font-[DM_Sans] text-[18px] font-semibold capitalize">
        My Past Streams
      </h2>

      {/* Cards */}
      {data.map((_, i) => (
        <div
          key={i}
          className="h-auto w-full shadow-sm rounded-[15px] p-[15px] flex flex-col gap-3 sm:h-[114px] sm:flex-row sm:items-center sm:justify-between"
        >
          {/* Left */}
          <div>
            <p className="font-[DM_Sans] text-[16px] font-semibold capitalize">
              Vedic Astrology Basics
            </p>

            <p className="font-[DM_Sans] text-[12px] font-normal text-gray-500 mt-1">
              25 Mar 2026
            </p>

            {/* Bottom Info */}
            <div className="flex gap-3 mt-2 text-gray-600 text-[12px] font-normal">
              <span className="flex items-center gap-1">
                <Clock size={14} /> 1 hr 45 min
              </span>

              <span className="flex items-center gap-1">
                <Eye size={14} /> 234
              </span>

              <span className="text-[#4898E1]">₹3500</span>
            </div>
          </div>

          {/* Status */}
          <span className="w-[84px] h-[22px] px-[10px] py-[3px] rounded-full bg-green-100 text-green-600 text-[11px] font-medium flex items-center justify-center">
            Completed
          </span>
        </div>
      ))}
    </div>
  );
}
