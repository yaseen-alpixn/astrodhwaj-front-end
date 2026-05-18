// app/content/page.tsx
import ContentHeader from "./ContentHeader";
import ContentPagination from "./ContentPagination";
import ContentTable from "./ContentTable";
import ContentStatAndFilters from "./ContentStatAndFilters";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-violet-50 p-4 py-8 pl-5 pr-2 md:p-8">
        <ContentHeader />
        <ContentStatAndFilters />
        <ContentTable />
        <ContentPagination />
      </div>
    </>
  );
}
