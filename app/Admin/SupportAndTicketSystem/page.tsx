import SupportAndTicketSystemHeader from "./SupportAndTicketSystemHeader";
import SupportAndTicketSystemStatsCard from "./SupportAndTicketSystemStatsCard";
import SupportAndTicketSystemTicketTable from "./SupportAndTicketSystemTicketTable";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-violet-50 py-8 pl-5 pr-2 md:p-6">
        <SupportAndTicketSystemHeader />
        <SupportAndTicketSystemStatsCard />
        <SupportAndTicketSystemTicketTable />
      </div>
    </>
  );
}
