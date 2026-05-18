// components/wallet/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function WalletPagination() {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button className="border p-2 rounded-md">
        <ChevronLeft />
      </button>

      <span>Page 1 of 10</span>

      <button className="border p-2 rounded-md">
        <ChevronRight />
      </button>
    </div>
  );
}
