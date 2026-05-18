// components/analytics/Header.tsx
import { Download } from "lucide-react";
import ExportButton from "../CommonComponents/ExportButton";

export default function ReportAnalyticsHeader() {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <h1 className="text-[28px] font-semibold">Reports & Analytics</h1>
        <p className="text-[14px] font-medium text-gray-500 mt-1">
          Comprehensive business insightss
        </p>
      </div>

      <ExportButton />
    </div>
  );
}
