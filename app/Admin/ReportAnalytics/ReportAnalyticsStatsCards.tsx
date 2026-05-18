// components/analytics/StatsCards.tsx
import { Users, Star, IndianRupee, Activity } from "lucide-react";
import Image from "next/image";
export default function ReportAnalyticsStatsCards() {
  const cards = [
    {
      label: "Total Users",
      value: "12,548",
      src: "/images/user.png",
      trend: "+12.5",
      color: "text-green-600",
    },
    {
      label: "Astrologers",
      value: "256",
      src: "/images/star.png",
      trend: "+12.5",
      color: "text-green-600",
    },
    {
      label: "Revenue",
      value: "₹19.8L",
      src: "/images/Group.png",
      trend: "+12.5",
      color: "text-green-600",
    },
    {
      label: "Consultations",
      value: "6,740",
      src: "/images/timeout.png",
      trend: "-8.5",
      color: "text-red-500",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:max-w-[800px] xl:max-w-full">
      {cards.map((c, i) => (
        <div
          key={i}
          className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between"
        >
          <div className="flex justify-between items-start">
            <div className="w-[40px] h-[40px] rounded-lg bg-[#F3E1FF] flex items-center justify-center">
              <Image src={c.src} width={15} height={15} alt={c.label + " icon"} />
            </div>
            <span className={`${c.color} text-[14px] font-medium`}>
              {c.trend}
            </span>
          </div>

          <div>
            <h2 className="text-[20px] font-medium">{c.value}</h2>
            <p className="text-[14px] font-medium">{c.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
