// components/user/StatsSection.tsx
import StatCard from "./StatCard";

export default function StatsSection() {
  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        src="/images/astrologerStar.png"
        value="4"
        label="Total Astrologers"
        bg="bg-[#4898E1]/10"
      />
      <StatCard
        src="/images/astrologerBluetick.png"
        value="2"
        label="Approved"
        bg="bg-blue-100"
      />
      <StatCard
        src="/images/astrologerApprove.png"
        value="1"
        label="Pending Approval"
        bg="bg-yellow-100"
      />
      <StatCard
        src="/images/astrologerUsers.png"
        value="2"
        label="Online Now"
        bg="bg-orange-100"
      />
      <StatCard
        src="/images/astrologerRevenue.png"
        value="₹15.9L"
        label="Total Revenue"
        bg="bg-green-100"
      />
    </div>
  );
}
