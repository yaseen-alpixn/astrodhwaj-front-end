// components/user/SearchBar.tsx
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative w-full lg:w-1/2 ">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
      <input
        placeholder="Search by name, email, contact number, UID..."
        className="w-full h-[40px] pl-10 pr-4 rounded-[10px] border  text-[13px]"
      />
    </div>
  );
}
