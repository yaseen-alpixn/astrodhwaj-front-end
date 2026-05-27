import { formatCurrency } from "../api";
import StatCard from "./StatCard";

type Props = {
  stats?: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    online?: number;
    revenue?: number;
  };
};

export default function StatsSection({ stats = { total: 0, approved: 0, pending: 0, rejected: 0, online: 0, revenue: 0 } }: Props) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        src="/images/astrologerStar.png"
        value={String(stats.total)}
        label="Total Astrologers"
        bg="bg-[#4898E1]/10"
      />
      <StatCard
        src="/images/astrologerBluetick.png"
        value={String(stats.approved)}
        label="Approved"
        bg="bg-blue-100"
      />
      <StatCard
        src="/images/astrologerApprove.png"
        value={String(stats.pending)}
        label="Pending Approval"
        bg="bg-yellow-100"
      />
      <StatCard
        src="/images/astrologerUsers.png"
        value={String(stats.online ?? 0)}
        label="Online Now"
        bg="bg-orange-100"
      />
      <StatCard
        src="/images/astrologerRevenue.png"
        value={formatCurrency(stats.revenue ?? 0)}
        label="Total Revenue"
        bg="bg-green-100"
      />
    </div>
  );
}
