"use client";

import { Search, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";

export default function SupportAndTicketSystemTicketTable() {
  const statusTabs = ["All", "Open", "In Progress", "Close"];
  const priorityTabs = ["All", "High", "Medium", "Low"];

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm w-full">
      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-4">
        {/* Search */}
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />

          <input
            placeholder="Search by name, categories..."
            className="w-full h-[42px] pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-3 overflow-x-auto">
          {/* Status Tabs */}
          <div className="flex bg-gray-200 rounded-lg p-1 min-w-fit">
            {statusTabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  index === 0
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Priority Tabs */}
          <div className="flex bg-gray-200 rounded-lg p-1 min-w-fit">
            {priorityTabs.map((tab, index) => (
              <button
                key={tab}
                className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  index === 0
                    ? "bg-blue-500 text-white shadow"
                    : "text-gray-600 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-gray-100">
              {[
                "Ticket ID",
                "Subject",
                "User",
                "Category",
                "Priority",
                "Status",
                "Created",
                "Actions",
              ].map((heading) => (
                <th
                  key={heading}
                  className="p-3 text-left md:text-center text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr
                key={row}
                className="border-b last:border-none text-xs sm:text-sm"
              >
                <td className="p-3 whitespace-nowrap">TKT001</td>
                <td className="p-3 md:text-center whitespace-nowrap">
                  Payment Not Reflected
                </td>
                <td className="p-3 md:text-center whitespace-nowrap">
                  Rahul Kumar
                </td>
                <td className="p-3 md:text-center whitespace-nowrap">
                  Payment
                </td>
                <td className="p-3 md:text-center whitespace-nowrap">Low</td>

                <td className="p-3 md:text-center">
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs whitespace-nowrap">
                    Open
                  </span>
                </td>

                <td className="p-3 md:text-center whitespace-nowrap">
                  26 Mar 2026
                </td>

                <td className="p-3">
                  <div className="flex justify-center gap-3 text-[#4898E1]">
                    <Link href="/Admin/SupportAndTicketSystem/TicketPopUp">
                      <Eye size={18} className="cursor-pointer" />
                    </Link>

                    <MoreVertical size={18} className="cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-5">
        <button className="border px-3 py-1 rounded-lg">{"<"}</button>

        <span className="text-xs sm:text-sm">Page 1 of 10</span>

        <button className="border px-3 py-1 rounded-lg">{">"}</button>
      </div>
    </div>
  );
}
