// app/commission/page.tsx
import Header from "./Header";
import CommissionRates from "./CommisionRates";
import RevenueDistribution from "./RevenueDistribution";
import RevenueTrend from "./RevenueTrend";
import TopAstrologers from "./TopAstrologer";
import ProjectedRevenue from "./ProjectedRevenue";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen w-full bg-white py-8 pl-5 pr-2">
        <Header />
        <CommissionRates />
        <RevenueDistribution />
        <RevenueTrend />
        <TopAstrologers />
        <ProjectedRevenue />
      </div>
    </>
  );
}
