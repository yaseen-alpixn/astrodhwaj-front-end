"use client";
import CallList from "./CallList";
import { Download } from "lucide-react";
import { formatCurrency } from "@/services/api";
import type { AstrologerDashboard } from "@/services/astrologer.service";

type EarningsBarsProps = {
  trend: AstrologerDashboard["earning_trend"];
  transactions: AstrologerDashboard["schedule"];
};

export default function EarningsBars({ trend, transactions }: EarningsBarsProps) {
  const maxAmount = Math.max(...trend.map((item) => item.amount), 1);
  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start w-full">
      <div className="w-full w-full lg:max-w-[770px] bg-[#F5F5F5] rounded-[15px] p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-[18px] font-semibold leading-[100%] capitalize">
            Earnings Trend
          </h2>

          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <button className="flex items-center gap-2 text-[#4898E1] text-[12px] font-medium">
              <Download className="w-[18px] h-[20px]" />
              Export
            </button>
          </div>
        </div>
        {/* Bars */}
        <div className="flex flex-col gap-4">
          {trend.map((item, i) => (
            <div key={i}>
              {/* Month + Amount */}
              <div className="mb-2 flex h-[20px] w-full items-center justify-between">
                <span className="text-[11px] font-medium">{item.month}</span>

                <span className="text-[16px] font-semibold text-[#4898E1] text-right capitalize">
                  {formatCurrency(item.amount)}
                </span>
              </div>

              {/* Progress Bar Background */}
              <div className="h-[9px] w-full overflow-hidden rounded-full bg-gray-300">
                {/* Filled Bar */}
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.max(6, (item.amount / maxAmount) * 100)}%`,
                    background:
                      "linear-gradient(90deg, #FFC107 0%, #4898E1 100%)",
                  }}
                />
              </div>
            </div>
          ))}
          {trend.length === 0 && <p className="text-[11px] font-medium">No earnings data</p>}
        </div>
      </div>{" "}
      <CallList data={transactions} />
    </div>
  );
}
