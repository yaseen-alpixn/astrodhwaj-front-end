// components/pricing/RevenueTrend.tsx
import { Calendar } from "lucide-react";

export default function RevenueTrend() {
  const months = [
    {
      name: "Oct 2026",
      data: [
        { label: "Audio Call", value: 31, color: "from-blue-600 to-blue-400" },
        {
          label: "Video Call",
          value: 21,
          color: "from-green-500 to-yellow-400",
        },
        {
          label: "Live Streams",
          value: 45,
          color: "from-yellow-400 to-red-500",
        },
        { label: "Chat", value: 3, color: "from-[#4898E1] to-[#4898E1]/80" },
      ],
    },
    {
      name: "Nov 2026",
      data: [
        { label: "Audio Call", value: 31, color: "from-blue-600 to-blue-400" },
        {
          label: "Video Call",
          value: 21,
          color: "from-green-500 to-yellow-400",
        },
        {
          label: "Live Streams",
          value: 45,
          color: "from-yellow-400 to-red-500",
        },
        { label: "Chat", value: 3, color: "from-[#4898E1] to-[#4898E1]/80" },
      ],
    },
    {
      name: "Dec 2026",
      data: [
        { label: "Audio Call", value: 31, color: "from-blue-600 to-blue-400" },
        {
          label: "Video Call",
          value: 21,
          color: "from-green-500 to-yellow-400",
        },
        {
          label: "Live Streams",
          value: 45,
          color: "from-yellow-400 to-red-500",
        },
        { label: "Chat", value: 3, color: "from-[#4898E1] to-[#4898E1]/80" },
      ],
    },
  ];

  return (
    <div className="mt-6 bg-white rounded-[10px] p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[20px] font-semibold">Revenue Trend Analysis</h2>
          <p className="text-[14px] font-medium text-gray-500">
            3-month comparison across service types
          </p>
        </div>

        <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-gray-100 text-[14px]">
          {["Last 3 Weeks", "Last 3 Months", "Year"].map((t, i) => (
            <button
              key={i}
              className={`h-[31px] rounded-[5px] px-[10px] py-[5px] md:w-[120px] ${
                t === "Last 3 Months"
                  ? "bg-[#4898E1] text-white"
                  : "bg-gray-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {months.map((month, i) => (
        <div key={i} className="mt-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-[17px] font-medium">
              <Calendar size={18} />
              {month.name}
            </div>
            <span className="font-medium">₹400K</span>
          </div>

          {/* Segmented Gradient Bar */}
          <div className="mt-3 flex h-[32px] w-full rounded-md overflow-hidden">
            {month.data.map((item, idx) => (
              <div
                key={idx}
                style={{ width: `${item.value}%` }}
                className={`flex items-center justify-center text-white text-[14px] font-medium bg-gradient-to-r ${item.color}`}
              >
                {item.value}%
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="mt-2 grid grid-cols-1 gap-1 text-[14px] text-gray-500 sm:grid-cols-2 lg:grid-cols-4">
            {month.data.map((item, idx) => (
              <span key={idx}>{item.label}: ₹120K</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
