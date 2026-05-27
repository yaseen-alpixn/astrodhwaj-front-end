"use client";

import { Clock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { adminApi, formatCurrency } from "../api";
import MonitorLiveModal from "./MonitorLiveModal";

type LiveSession = {
  id: string;
  title: string;
  status: string;
  viewer_count?: number;
  revenue?: number;
  metadata?: { astrologer_name?: string; duration_minutes?: number };
};

export default function LiveSessionsList() {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [monitoringId, setMonitoringId] = useState<string | null>(null);

  const fetchSessions = () => {
    adminApi<LiveSession[]>("/admin/live-sessions?page=1&limit=5")
      .then((response) => setSessions(response.data || []))
      .catch(() => setSessions([]));
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className=" rounded-b-lg space-y-4 bg-white p-3">
      {sessions.map((session, i) => (
        <div key={session.id || i} className="flex flex-col gap-3 rounded-[10px] shadow-sm bg-gray-50 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-yellow-100 to-[#4898E1]/10 flex items-center justify-center">
              <span className="font-medium text-[#4898E1]">{(session.metadata?.astrologer_name || "AS").slice(0, 2).toUpperCase()}</span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[15px] font-medium">{session.metadata?.astrologer_name || "Astrologer"}</h3>
                <span className="rounded-full bg-red-600 px-2 py-1 text-xs text-white">● {session.status === "live" ? "Live" : session.status}</span>
              </div>
              <p className="text-gray-500 text-sm">{session.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-black">
                <span className="flex items-center gap-1"><Clock size={14} /> {session.metadata?.duration_minutes || 0} min</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {session.viewer_count || 0}</span>
                <span className="text-green-600">{formatCurrency(session.revenue)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="px-4 py-1 rounded-md border border-green-700 text-green-600 bg-green-50 border-2" onClick={() => setMonitoringId(session.id)}>Monitor</button>
            <button className="px-5 py-2 rounded-md border border-2 border-red-500 text-red-600 bg-red-50" onClick={() => adminApi(`/admin/live-sessions/${session.id}/end`, { method: "PATCH", body: JSON.stringify({}) }).then(() => setSessions((current) => current.filter((item) => item.id !== session.id)))}>End</button>
          </div>
        </div>
      ))}

      {monitoringId && (
        <MonitorLiveModal
          sessionId={monitoringId}
          onClose={() => {
            setMonitoringId(null);
            fetchSessions();
          }}
        />
      )}
    </div>
  );
}
