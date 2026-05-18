export default function StatsGrid() {
  const stats = [
    {
      label: "Total Streams",
      value: "2",
      bg: "bg-yellow-100",
      border: "border-yellow-400",
    },
    {
      label: "Total Earned",
      value: "₹6,340",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    {
      label: "Total Viewers",
      value: "423",
      bg: "bg-blue-100",
      border: "border-blue-500",
    },
    {
      label: "Avg Duration",
      value: "60m",
      bg: "bg-[#4898E1]/10",
      border: "border-[#4898E1]",
    },
  ];

  return (
    <div className="mt-3 w-full">
      <h2 className="text-[18px] md:text-[20px] font-semibold capitalize">
        Live Streaming Earnings
      </h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        {stats.map((item, i) => (
          <div
            key={i}
            className={`min-h-[90px] md:min-h-[110px] rounded-xl border p-4 ${item.bg} ${item.border}`}
          >
            <p className="text-sm md:text-[15px] font-medium text-gray-700">
              {item.label}
            </p>

            <p className="mt-2 text-xl md:text-2xl font-bold text-[#4898E1]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
