// components/analytics/TrendsSection.tsx
import { Search } from "lucide-react";

export default function ReportAnalyticsTrendSection() {
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = ["January", "February", "March", "April", "May", "June"];

  return (
    <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* LEFT: User Growth */}
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base md:text-[17px] font-medium">
            User Growth Trend
          </h2>

          <div className="relative w-full sm:max-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />

            <input
              className="h-[40px] w-full rounded-lg border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
              placeholder="Search by week, date..."
            />
          </div>
        </div>

        {days.map((day, i) => (
          <div key={i} className="mb-5">
            <div className="flex justify-between items-center text-sm flex-wrap gap-2">
              <span>{day}</span>
              <span className="text-gray-700">8,420 Users</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-yellow-500 rounded-full"
                style={{ width: `${60 + i * 5}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT: Revenue */}
      <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base md:text-[17px] font-medium">
            Revenue Overview
          </h2>

          <div className="relative w-full sm:max-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={16}
            />

            <input
              className="h-[40px] w-full rounded-lg border pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
              placeholder="Search by month, date..."
            />
          </div>
        </div>

        {months.map((month, i) => (
          <div key={i} className="mb-5">
            <div className="flex justify-between items-center text-sm flex-wrap gap-2">
              <span>{month}</span>

              <span className="text-green-600 font-medium">₹67K</span>
            </div>

            <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${70 - i * 8}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
