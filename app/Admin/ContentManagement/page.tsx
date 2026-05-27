"use client";

// app/content/page.tsx
import ContentHeader from "./ContentHeader";
import ContentPagination from "./ContentPagination";
import ContentTable from "./ContentTable";
import ContentStatAndFilters from "./ContentStatAndFilters";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { useState } from "react";
import type { ApiMeta } from "../api";

export default function Page() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [meta, setMeta] = useState<ApiMeta | null>(null);

  return (
    <>
      {" "}
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white p-4 py-8 pl-5 pr-2 md:p-8">
        <ContentHeader />
        <ContentStatAndFilters search={search} status={status} onSearchChange={(value) => { setPage(1); setSearch(value); }} onStatusChange={(value) => { setPage(1); setStatus(value); }} />
        <ContentTable page={page} search={search} status={status} onMetaChange={setMeta} />
        <ContentPagination page={page} totalPages={meta?.total_pages || 1} onPageChange={setPage} />
      </div>
    </>
  );
}
