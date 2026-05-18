import { Bell, Search, User } from "lucide-react";

export default function AdminTopHeader() {
  return (
    <div className="flex w-full flex-col items-start justify-between gap-3 bg-white p-2 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex h-[43px] w-full min-w-0 items-center gap-[10px] rounded-[10px] border border-gray-300 p-[15px] sm:w-[347px]">
        <Search className="h-[18px] w-[18px] text-gray-600" />
        <input
          type="text"
          placeholder="Search here..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-600"
        />
      </div>

      <div className="flex items-center gap-[15px]">
        <button className="flex h-[25px] w-[22px] items-center justify-center text-gray-700">
          <Bell className="h-[18px] w-[18px]" />
        </button>
        <button className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-gray-100 text-gray-700">
          <User className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
