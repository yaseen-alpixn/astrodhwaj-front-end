// app/analytics/page.tsx
import ReportAnalyticsHeader from "./ReportAnalyticsHeader";
import ReportAnalyticsStatsCards from "./ReportAnalyticsStatsCards";
import ReportAnalyticsTrendSection from "./ReportAnalyticsTrendSection";
import ReportAnalyticsCategory from "./ReportAnalyticsCategory";
import ReportAnalyticsPagination from "./ReportAnalyticsPagination";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen w-full overflow-x-hidden bg-purple-50 py-8 pl-5 pr-2 md:p-8">
        <ReportAnalyticsHeader />
        <ReportAnalyticsStatsCards />
        <ReportAnalyticsTrendSection />
        <ReportAnalyticsCategory />
        <ReportAnalyticsPagination />
      </div>
    </>
  );
}
