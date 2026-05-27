"use client";

import { Search, MoreVertical, Eye } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, formatDate, qs, titleCase, type ApiMeta } from "../api";

const statusColors: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  reopened: "bg-purple-50 text-purple-700 border-purple-200",
};

type Ticket = {
  id: string;
  ticket_no: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at?: string;
  metadata?: { user_name?: string };
};

export default function SupportAndTicketSystemTicketTable() {
  const statusTabs = ["All", "Open", "In Progress", "Close"];
  const priorityTabs = ["All", "High", "Medium", "Low"];
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [priority, setPriority] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi<Ticket[]>(`/admin/support-tickets${qs({ page, limit: 5, search, status, priority })}`)
      .then((response) => {
        setTickets(response.data || []);
        setMeta(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setTickets([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unable to load tickets");
      })
      .finally(() => setLoading(false));
  }, [page, search, status, priority]);

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm w-full">
      <div className="mb-4 flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input placeholder="Search by name, categories..." value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} className="w-full h-[42px] pl-10 pr-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]" />
        </div>
        <div className="flex flex-col lg:flex-row gap-3 overflow-x-auto">
          <div className="flex bg-gray-200 rounded-lg p-1 min-w-fit">
            {statusTabs.map((tab) => (
              <button key={tab} onClick={() => { setPage(1); setStatus(tab); }} className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${status === tab ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-300"}`}>{tab}</button>
            ))}
          </div>
          <div className="flex bg-gray-200 rounded-lg p-1 min-w-fit">
            {priorityTabs.map((tab) => (
              <button key={tab} onClick={() => { setPage(1); setPriority(tab); }} className={`px-4 sm:px-6 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${priority === tab ? "bg-blue-500 text-white shadow" : "text-gray-600 hover:bg-gray-300"}`}>{tab}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full overflow-x-auto rounded-lg">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="border-b bg-gray-100">
              {["Ticket ID", "Subject", "User", "Category", "Priority", "Status", "Created", "Actions"].map((heading) => (
                <th key={heading} className="p-3 text-left md:text-center text-xs sm:text-sm font-medium whitespace-nowrap">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td className="p-6 text-center text-gray-500" colSpan={8}>Loading...</td></tr>}
            {!loading && error && <tr><td className="p-6 text-center text-red-500" colSpan={8}>{error}</td></tr>}
            {!loading && !error && tickets.length === 0 && <tr><td className="p-6 text-center text-gray-500" colSpan={8}>No tickets found</td></tr>}
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b last:border-none text-xs sm:text-sm">
                <td className="p-3 whitespace-nowrap">{ticket.ticket_no}</td>
                <td className="p-3 md:text-center whitespace-nowrap">{ticket.subject}</td>
                <td className="p-3 md:text-center whitespace-nowrap">{ticket.metadata?.user_name || "-"}</td>
                <td className="p-3 md:text-center whitespace-nowrap">{ticket.category}</td>
                <td className="p-3 md:text-center whitespace-nowrap">
                  <span className={`font-semibold ${
                    ticket.priority === "high" ? "text-red-600" :
                    ticket.priority === "medium" ? "text-amber-600" :
                    ticket.priority === "low" ? "text-green-600" : "text-gray-600"
                  }`}>
                    {titleCase(ticket.priority)}
                  </span>
                </td>
                <td className="p-3 md:text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${statusColors[ticket.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {titleCase(ticket.status)}
                  </span>
                </td>
                <td className="p-3 md:text-center whitespace-nowrap">{formatDate(ticket.created_at)}</td>
                <td className="p-3">
                  <div className="flex justify-center gap-3 text-[#4898E1]">
                    <Link href={`/Admin/SupportAndTicketSystem/TicketPopUp?id=${ticket.id}`}><Eye size={18} className="cursor-pointer" /></Link>
                    <MoreVertical size={18} className="cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-3 mt-5">
        <button className="border px-3 py-1 rounded-lg" onClick={() => setPage((current) => Math.max(1, current - 1))}>{"<"}</button>
        <span className="text-xs sm:text-sm">Page {page} of {meta?.total_pages || 1}</span>
        <button className="border px-3 py-1 rounded-lg" onClick={() => setPage((current) => Math.min(meta?.total_pages || current, current + 1))}>{">"}</button>
      </div>
    </div>
  );
}
