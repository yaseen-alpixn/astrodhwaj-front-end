import { Search } from "lucide-react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function SearchBar({ value = "", onChange }: Props) {
  return (
    <div className="relative w-full lg:w-1/2 ">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} />
      <input
        placeholder="Search by name, email, contact number, UID..."
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full h-[40px] pl-10 pr-4 rounded-[10px] border  text-[13px]"
      />
    </div>
  );
}
