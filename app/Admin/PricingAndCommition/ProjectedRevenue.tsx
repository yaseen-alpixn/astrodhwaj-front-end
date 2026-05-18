// components/pricing/ProjectedRevenue.tsx
export default function ProjectedRevenue() {
  const data = [
    { label: "Audio Sessions", value: "₹28,400" },
    { label: "Chat Sessions", value: "₹19,600" },
    { label: "Video Sessions", value: "₹31,200" },
    { label: "Live Stream", value: "₹25,200" },
  ];

  return (
    <div className="mt-6 bg-gradient-to-r from-[#0DAD9A] to-[#0ED20B] p-5 rounded-[10px] text-white shadow-sm">
      <h2 className="text-[20px] font-semibold mb-4">
        Projected Monthly Revenue from Commission
      </h2>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="flex-1 border border-white/30 rounded-[10px] p-2"
          >
            <p>{item.label}</p>
            <h3 className="text-[20px] font-semibold mt-2">{item.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
