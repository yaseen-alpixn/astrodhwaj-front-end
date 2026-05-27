"use client";

import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminTopHeader from "../CommonComponents/AdminTopHeader";
import { adminDownload, adminApi, formatDate, qs, type ApiMeta } from "../api";

type AuditLog = {
  id: string;
  action: string;
  target_type: string;
  target_id?: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [action, setAction] = useState("All");
  const [targetType, setTargetType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLogs = useCallback(() => {
    adminApi<AuditLog[]>(`/admin/audit-logs${qs({ page, limit: 10, search, action, target_type: targetType })}`)
      .then((response) => {
        setLogs(response.data || []);
        setMeta(response.meta || null);
        setError("");
      })
      .catch((err) => {
        setLogs([]);
        setMeta(null);
        setError(err instanceof Error ? err.message : "Unable to load audit logs");
      })
      .finally(() => setLoading(false));
  }, [page, search, action, targetType]);

  useEffect(() => {
    loadLogs();
  }, [page, search, action, targetType]);

  const exportLogs = async () => {
    const blob = await adminDownload(`/admin/audit-logs/export${qs({ action, target_type: targetType })}`);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <AdminTopHeader />
      <div className="min-h-screen overflow-x-hidden bg-white py-8 pl-5 pr-2 md:p-6">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-[28px] font-semibold tracking-tight">Audit Logs</h1>
            <p className="text-[14px] font-medium text-gray-500">Track admin actions and system changes</p>
          </div>
          <button onClick={exportLogs} className="flex h-[42px] items-center justify-center rounded-lg bg-[#4898E1] px-[18px] text-[16px] text-white md:w-[185px] whitespace-nowrap">
            Export Data
          </button>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-[380px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search audit logs..." className="w-full h-[42px] border rounded-lg pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4898E1]" />
          </div>
          <div className="flex gap-2">
            <select value={action} onChange={(event) => { setPage(1); setAction(event.target.value); }} className="border rounded-lg px-3 py-2 text-sm">
              <option>All</option>
              <option>UPDATE_SETTINGS</option>
              <option>REFUND_TRANSACTION</option>
              <option>BLOCK_USER</option>
              <option>CREATE_ROLE</option>
            </select>
            <select value={targetType} onChange={(event) => { setPage(1); setTargetType(event.target.value); }} className="border rounded-lg px-3 py-2 text-sm">
              <option>All</option>
              <option>user</option>
              <option>transaction</option>
              <option>settings</option>
              <option>role</option>
              <option>support_ticket</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Action</th>
                <th className="p-3 text-center text-sm font-medium">Target</th>
                <th className="p-3 text-center text-sm font-medium">Target ID</th>
                <th className="p-3 text-center text-sm font-medium">Details</th>
                <th className="p-3 text-center text-sm font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td className="p-6 text-center text-gray-500" colSpan={5}>Loading...</td></tr>}
              {!loading && error && <tr><td className="p-6 text-center text-red-500" colSpan={5}>{error}</td></tr>}
              {!loading && !error && logs.length === 0 && <tr><td className="p-6 text-center text-gray-500" colSpan={5}>No audit logs found</td></tr>}
              {logs.map((log) => (
                <tr key={log.id} className="border-b text-sm">
                  <td className="p-3">{log.action}</td>
                  <td className="p-3 text-center">{log.target_type}</td>
                  <td className="p-3 text-center">{log.target_id || "-"}</td>
                  <td className="p-3 text-center">{JSON.stringify(log.metadata || {})}</td>
                  <td className="p-3 text-center">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setPage((current) => Math.max(1, current - 1))} className="border px-3 py-1 rounded-lg">{"<"}</button>
          <span className="text-sm">Page {page} of {meta?.total_pages || 1}</span>
          <button onClick={() => setPage((current) => Math.min(meta?.total_pages || current, current + 1))} className="border px-3 py-1 rounded-lg">{">"}</button>
        </div>
      </div>
    </>
  );
}
