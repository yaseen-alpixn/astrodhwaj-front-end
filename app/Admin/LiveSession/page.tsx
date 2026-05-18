// app/live/page.tsx
import LiveSessionHeader from "./LiveSessionHeader";
import LiveSessionList from "./LiveSessionsList";
import LiveSessionFilters from "./LiveSessionFilters";
import LiveSessionPagination from "./LiveSessionPagination";
import LiveSessionStatsCards from "./LiveSessionStatsCards";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen w-full bg-violet-50 py-8 pl-5 pr-2">
        <LiveSessionHeader />
        <LiveSessionStatsCards />
        <LiveSessionFilters />
        <LiveSessionList />
        <LiveSessionPagination />
      </div>
    </>
  );
}
