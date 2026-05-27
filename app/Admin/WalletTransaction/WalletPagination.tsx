// components/wallet/Pagination.tsx
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
};

export default function WalletPagination({ page = 1, totalPages = 1, onPageChange }: Props) {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button className="border p-2 rounded-md" onClick={() => onPageChange?.(Math.max(1, page - 1))}>
        <ChevronLeft />
      </button>

      <span>Page {page} of {totalPages}</span>

      <button className="border p-2 rounded-md" onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}>
        <ChevronRight />
      </button>
    </div>
  );
}
