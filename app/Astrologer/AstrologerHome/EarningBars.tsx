"use client";
import CallList from "./CallList";
import { Download } from "lucide-react";

const data2 = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 85 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 95 },
  { month: "May", value: 75 },
  { month: "Jun", value: 92 },
];

export default function EarningsBars() {
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start w-full">
      <div className="w-full w-full lg:max-w-[770px] bg-[#F5F5F5] rounded-[15px] p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-[18px] font-semibold leading-[100%] capitalize">
            Earnings Trend
          </h2>

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="flex items-center gap-2 text-purple-600 text-[12px] font-medium">
              <Download className="w-[18px] h-[20px]" />
              Export
            </button>
          </div>
        </div>
        {/* Bars */}
        <div className="flex flex-col gap-4">
          {data2.map((item, i) => (
            <div key={i}>
              {/* Month + Amount */}
              <div className="mb-2 flex h-[20px] xl:h-[33px] w-full items-center justify-between">
                <span className="text-[11px] font-medium">{item.month}</span>

                <span className="text-[16px] font-semibold text-purple-700 text-right capitalize">
                  ₹45,000
                </span>
              </div>

              {/* Progress Bar Background */}
              <div className="h-[9px] w-full overflow-hidden rounded-full bg-gray-300">
                {/* Filled Bar */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    background:
                      "linear-gradient(90deg, #FFC107 0%, #8E24AA 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      <CallList />
    </div>
  );
}
