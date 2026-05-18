// components/pricing/CommissionRates.tsx
export default function CommissionRates() {
  const data = [
    { label: "Audio Call", value: 20 },
    { label: "Chat", value: 10 },
    { label: "Video Call", value: 25 },
    { label: "Live Stream", value: 50 },
  ];

  return (
    <div className="mt-4 rounded-[10px] p-3 bg-white">
      <h2 className="text-[20px] font-semibold mb-4">Commission Rates</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((item, i) => (
          <div
            key={i}
            className="h-[132px] w-full rounded-[10px] border border-purple-900 bg-purple-100 p-[15px] flex shadow-sm flex-col justify-between"
          >
            <p className="text-[15px] font-medium">{item.label}</p>

            <div className="flex items-center justify-between">
              <span className="text-[24px] w-[130px] rounded-lg border pl-1 font-medium">
                {item.value}
              </span>
              <span className="text-[24px] text-purple-600 font-medium">%</span>
            </div>

            <p className="text-[14px] font-normal text-gray-500">
              Platform commission
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
