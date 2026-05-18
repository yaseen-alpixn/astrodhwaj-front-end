import { Search } from "lucide-react";

export default function WalletFilters() {
  const tabs = ["All", "Recharge", "Consultations", "Withdrawals"];

  return (
    <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white shadow-sm p-4 rounded-t-xl">
      {/* Search */}
      <div className="relative w-full lg:max-w-[400px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />

        <input
          placeholder="Search by user ID, order..."
          className="w-full h-[44px] pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* Tabs */}
      <div className="w-full lg:w-auto ">
        <div className="flex gap-2 min-w-fit">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`px-4 sm:px-5 py-2 rounded-lg text-xs sm:text-sm whitespace-nowrap transition-all ${
                tab === "All"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
