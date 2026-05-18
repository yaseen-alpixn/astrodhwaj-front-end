// components/live/LiveSessionsList.tsx
import { Clock, Eye } from "lucide-react";

export default function LiveSessionsList() {
  return (
    <div className=" rounded-b-lg space-y-4 bg-white p-3">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-[10px] shadow-sm bg-purple-50 p-5 lg:flex-row lg:items-center lg:justify-between"
          >
            {/* Left */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-yellow-100 to-purple-100 flex items-center justify-center">
                <span className="font-medium text-purple-600">PS</span>
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-[15px] font-medium">
                    Astrologer Priya Sharma
                  </h3>

                  {/* Live Badge */}
                  <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">
                    ● Live
                  </span>
                </div>

                <p className="text-gray-500 text-sm">Vedic Astrology Basics</p>

                {/* Meta */}
                <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-black">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> 45 min
                  </span>

                  <span className="flex items-center gap-1">
                    <Eye size={14} /> 234
                  </span>

                  <span className="text-green-600">₹3500</span>
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-1 rounded-md border border-green-700 text-green-600 bg-green-50 border-2">
                Monitor
              </button>

              <button className="px-5 py-2 rounded-md border border-2 border-red-500 text-red-600 bg-red-50">
                End
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
