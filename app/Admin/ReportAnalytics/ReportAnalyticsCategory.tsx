import { Search, Trash } from "lucide-react";

export default function ReportAnalyticsCategory() {
  return (
    <div className="mt-6 rounded-xl bg-white shadow-sm p-4 md:p-5">
      {/* Top */}
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative w-full md:max-w-[400px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />

          <input
            placeholder="Search by title, type, categories..."
            className="w-full h-[42px] pl-10 pr-4 rounded-lg border text-sm md:text-[15px] focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {["All", "Month", "Quarter", "Year"].map((t, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded-lg text-sm md:text-[14px] whitespace-nowrap ${
                t === "All"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="min-w-[1100px] w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left text-sm md:text-[15px] font-medium whitespace-nowrap">
                Category
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Sessions
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Revenue
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Growth
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Trend
              </th>

              <th className="p-3 text-center text-sm md:text-[15px] font-medium whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {Array(9)
              .fill(0)
              .map((_, i) => {
                const positive = i % 2 === 0;

                return (
                  <tr
                    key={i}
                    className="border-b last:border-none text-sm md:text-[14px]"
                  >
                    <td className="p-3 whitespace-nowrap">Vedic Astrology</td>

                    <td className="p-3 text-center whitespace-nowrap">2,840</td>

                    <td className="p-3 text-center text-green-600 whitespace-nowrap">
                      ₹7.1L
                    </td>

                    {/* Growth */}
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs md:text-sm whitespace-nowrap ${
                          positive
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {positive ? "↑ 12.5%" : "↓ 2.5%"}
                      </span>
                    </td>

                    {/* Trend */}
                    <td className="p-3">
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-full bg-purple-600 rounded-full"
                          style={{
                            width: `${60 + (i % 3) * 10}%`,
                          }}
                        />
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-3">
                      <div className="flex justify-center">
                        <Trash
                          size={18}
                          className="text-red-500 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
