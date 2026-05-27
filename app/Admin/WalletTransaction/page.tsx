"use client";

// app/wallet/page.tsx
import WalletHeader from "./WalletHeader";
import WalletFilters from "./WalletFilters";
import WalletPagination from "./WalletPagination";
import WalletStatsCards from "./WalletStatsCards";
import WalletTransactions from "./WalletTransactions";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { useState } from "react";
import type { ApiMeta } from "../api";

export default function Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [meta, setMeta] = useState<ApiMeta | null>(null);

  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white py-8 pl-3 pr-1 md:p-8">
        <WalletHeader />
        <WalletStatsCards />
        <WalletFilters search={search} type={type} onSearchChange={(value) => { setPage(1); setSearch(value); }} onTypeChange={(value) => { setPage(1); setType(value); }} />
        <WalletTransactions page={page} search={search} type={type} onMetaChange={setMeta} />
        <WalletPagination page={page} totalPages={meta?.total_pages || 1} onPageChange={setPage} />
      </div>
    </>
  );
}
