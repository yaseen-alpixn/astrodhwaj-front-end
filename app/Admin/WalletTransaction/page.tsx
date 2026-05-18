// app/wallet/page.tsx
import WalletHeader from "./WalletHeader";
import WalletFilters from "./WalletFilters";
import WalletPagination from "./WalletPagination";
import WalletStatsCards from "./WalletStatsCards";
import WalletTransactions from "./WalletTransactions";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";

export default function Page() {
  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-violet-50 py-8 pl-3 pr-1 md:p-8">
        <WalletHeader />
        <WalletStatsCards />
        <WalletFilters />
        <WalletTransactions />
        <WalletPagination />
      </div>
    </>
  );
}
