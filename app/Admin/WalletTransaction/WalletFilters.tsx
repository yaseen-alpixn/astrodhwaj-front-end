import { Search } from "lucide-react";

type Props = {
  search?: string;
  type?: string;
  onSearchChange?: (value: string) => void;
  onTypeChange?: (value: string) => void;
};

export default function WalletFilters({ search = "", type = "All", onSearchChange, onTypeChange }: Props) {
  const tabs = ["All", "Recharge", "Consultations", "Withdrawals"];

  return (
    <div className="mt-6  flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white shadow-sm p-4 rounded-t-xl">
      {/* Search */}
      <div className="relative w-full md:max-w-[400px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />

        <input
          placeholder="Search by user ID, order..."
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="w-full h-[44px] pl-10 pr-4 rounded-lg border text-sm md:text-[15px] focus:outline-none focus:ring-2 focus:ring-[#4898E1]"
        />
      </div>

      {/* Tabs */}
      <div className="flex  gap-2 justify-start md:justify-end">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => onTypeChange?.(tab)}
            className={`px-4 py-2 rounded-lg text-sm md:text-[14px] whitespace-nowrap transition-all ${
              tab === type
                ? "bg-[#4898E1] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
