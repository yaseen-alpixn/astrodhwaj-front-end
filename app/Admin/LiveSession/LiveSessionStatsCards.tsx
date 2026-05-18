// components/live/StatsCards.tsx
import { Radio, Users, IndianRupee, Clock } from "lucide-react";

export default function LiveSessionStatsCards() {
  const cards = [
    {
      label: "Active Sessions",
      value: "10",
      icon: <Radio />,
      bg: "bg-red-100",
    },
    {
      label: "Total Viewers",
      value: "238",
      icon: <Users />,
      bg: "bg-purple-100",
    },
    {
      label: "Live Earnings",
      value: "₹5,966",
      icon: <IndianRupee />,
      bg: "bg-yellow-100",
    },
    {
      label: "Avg Duration",
      value: "26 min",
      icon: <Clock />,
      bg: "bg-blue-100",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className="h-[130px] w-full rounded-2xl bg-white p-3 shadow-sm flex flex-col justify-between"
        >
          <div className="w-[40px] h-[40px] rounded-lg bg-[#F3E1FF] flex items-center justify-center text-violet-700">
            {card.icon}
          </div>

          <div>
            <h2 className="text-[20px] font-medium">{card.value}</h2>
            <p className="text-[14px] font-medium whitespace-nowrap">
              {card.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
