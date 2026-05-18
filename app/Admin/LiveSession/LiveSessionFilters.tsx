// components/live/Filters.tsx
import { Search } from "lucide-react";

export default function LiveSessionFilters() {
  const tabs = ["All", "Vedic", "Tarot"];

  return (
    <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-white p-3 rounded-t-lg shadow-sm">
      <div className="relative w-full md:w-[400px]">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2"
          size={18}
        />
        <input
          placeholder="Search by name, categories..."
          className="w-full h-[40px] pl-10 pr-4 rounded-[10px] border text-center text-[16px]"
        />
      </div>

      <div className="flex flex-wrap gap-3 rounded-lg bg-purple-100 p-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`w-[96px] h-[31px] px-[10px] py-[5px] rounded-[5px] ${
              tab === "All"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
