// components/pricing/TopAstrologers.tsx

export default function TopAstrologers() {
  const data = [
    { rank: "01", progress: 95 },
    { rank: "02", progress: 65 },
    { rank: "03", progress: 85 },
    { rank: "04", progress: 55 },
    { rank: "05", progress: 75 },
  ];

  return (
    <div className="mt-6  rounded-[10px] p-5 bg-white shadow-sm">
      <h2 className="text-[20px] font-semibold">Top 5 Performing Astrologers</h2>
      <p className="text-[14px] font-medium text-gray-500 mb-4">
        Highest commission contributors this month
      </p>

      {data.map((item, i) => (
        <div key={i} className="mb-6">
          {/* Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] flex items-center justify-center text-[#4898E1] font-medium">
                {item.rank}
              </div>

              <div>
                <p className="font-medium text-[15px]">Dr. Priya Sharma</p>
                <p className="text-gray-500 text-sm">
                  Revenue: ₹45,000 • 156 Sessions
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-[#4898E1] font-medium text-[15px]">₹9,000</p>
              <p className="text-sm text-gray-500">Commission</p>
            </div>
          </div>

          {/* 🔥 PROGRESS BAR (FIXED) */}
          <div className="mt-3 w-full h-[8px] bg-gray-200 rounded-full">
            <div
              className="h-full bg-[#4898E1] rounded-full transition-all duration-500"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
