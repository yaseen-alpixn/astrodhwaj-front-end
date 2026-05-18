// app/user-management/page.tsx
import Header from "./Header";
import StatsSection from "./StatsSection";
import SearchBar from "./SearchBar";
import FilterTabs from "./FilterTabs";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white p-2 py-8 pl-5 pr-2 md:p-8">
        <Header />

        <StatsSection />

        <div className="mt-6 flex flex-col lg:flex-row bg-white p-4 shadow-sm rounded-lg gap-3 md:flex-row md:items-center md:justify-between">
          <SearchBar />
          <FilterTabs />
        </div>

        <UserTable />

        <Pagination />
      </div>
    </>
  );
}
