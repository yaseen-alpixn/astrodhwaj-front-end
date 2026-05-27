"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApi, formatDate, qs, type ApiMeta } from "../../api";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  channel: string;
  audience: string;
  status: string;
  created_at?: string;
};

export default function NotificationSection() {
  const [settings, setSettings] = useState([
    {
      title: "User Registration Notifications",
      desc: "Notify admins when new users register",
      enabled: true,
    },
    {
      title: "Transaction Alerts",
      desc: "Get notified about high-value transactions",
      enabled: true,
    },
    {
      title: "Astrologer Approval Requests",
      desc: "Notify when astrologers apply for verification",
      enabled: true,
    },
    {
      title: "Support Ticket Notifications",
      desc: "Alert when new support tickets are created",
      enabled: true,
    },
    {
      title: "Daily Reports",
      desc: "Receive daily analytics summary via email",
      enabled: true,
    },
  ]);
  const [form, setForm] = useState({ title: "", message: "", channel: "in-app", audience: "all", scheduled_at: "" });
  const [history, setHistory] = useState<NotificationItem[]>([]);
  const [meta, setMeta] = useState<ApiMeta | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [feedback, setFeedback] = useState("");

  const loadHistory = useCallback(() => {
    adminApi<NotificationItem[]>(`/admin/notifications${qs({ page, limit: 5, search, status })}`)
      .then((response) => {
        setHistory(response.data || []);
        setMeta(response.meta || null);
      })
      .catch(() => setHistory([]));
  }, [page, search, status]);

  useEffect(() => {
    adminApi<{ values?: { settings?: typeof settings } }>("/admin/settings/notification")
      .then((response) => {
        if (response.data.values?.settings) setSettings(response.data.values.settings);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const toggle = (index: number) => {
    const updated = [...settings];
    updated[index].enabled = !updated[index].enabled;
    setSettings(updated);
    adminApi("/admin/settings/notification", { method: "PUT", body: JSON.stringify({ values: { settings: updated } }) }).catch(() => undefined);
  };

  const sendNotification = () => {
    adminApi("/admin/notifications/send", {
      method: "POST",
      body: JSON.stringify({ ...form, scheduled_at: form.scheduled_at || null }),
    })
      .then(() => {
        setFeedback("Notification saved");
        setForm({ title: "", message: "", channel: "in-app", audience: "all", scheduled_at: "" });
        loadHistory();
      })
      .catch((err) => setFeedback(err instanceof Error ? err.message : "Send failed"));
  };

  const deleteNotification = (id: string) => {
    setHistory((current) => current.filter((item) => item.id !== id));
    adminApi(`/admin/notifications/${id}`, { method: "DELETE" }).catch(() => loadHistory());
  };

  return (
    <div className="shadow-sm rounded-xl p-6 bg-white">
      <h2 className="text-[20px] font-semibold mb-4">
        Push Notification Settings
      </h2>

      {settings.map((item, i) => (
        <div
          key={i}
          className="flex justify-between items-center p-4 mb-3 rounded-lg bg-gray-100"
        >
          {/* Text */}
          <div>
            <h3 className="text-[16px] font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => toggle(i)}
            className={`w-[42px] h-[22px] flex items-center px-1 rounded-full transition ${
              item.enabled ? "bg-[#4898E1] justify-end" : "bg-gray-300"
            }`}
          >
            <div className="w-[16px] h-[16px] bg-white rounded-full" />
          </button>
        </div>
      ))}

      <div className="mt-6 rounded-xl border p-4">
        <h2 className="text-[20px] font-semibold mb-4">Send Notification</h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} placeholder="Title" className="border rounded-lg p-3 text-sm" />
          <select value={form.channel} onChange={(event) => setForm((current) => ({ ...current, channel: event.target.value }))} className="border rounded-lg p-3 text-sm">
            <option value="in-app">In-app</option>
            <option value="email">Email</option>
            <option value="broadcast">Broadcast</option>
          </select>
          <input value={form.audience} onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))} placeholder="Audience" className="border rounded-lg p-3 text-sm" />
          <input type="datetime-local" value={form.scheduled_at} onChange={(event) => setForm((current) => ({ ...current, scheduled_at: event.target.value }))} className="border rounded-lg p-3 text-sm" />
        </div>
        <textarea value={form.message} onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Message" className="mt-3 w-full border rounded-lg p-3 text-sm" />
        <div className="mt-3 flex justify-end">
          <button onClick={sendNotification} className="bg-[#4898E1] text-white px-6 py-2 rounded-md">Send Notification</button>
        </div>
        {feedback && <p className="mt-2 text-right text-sm text-gray-500">{feedback}</p>}
      </div>

      <div className="mt-6 rounded-xl border p-4">
        <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input value={search} onChange={(event) => { setPage(1); setSearch(event.target.value); }} placeholder="Search notifications..." className="border rounded-lg p-3 text-sm" />
          <select value={status} onChange={(event) => { setPage(1); setStatus(event.target.value); }} className="border rounded-lg p-3 text-sm">
            <option>All</option>
            <option>sent</option>
            <option>scheduled</option>
            <option>deleted</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left text-sm">Title</th>
                <th className="p-3 text-center text-sm">Channel</th>
                <th className="p-3 text-center text-sm">Audience</th>
                <th className="p-3 text-center text-sm">Status</th>
                <th className="p-3 text-center text-sm">Created</th>
                <th className="p-3 text-center text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && <tr><td className="p-6 text-center text-gray-500" colSpan={6}>No notifications found</td></tr>}
              {history.map((item) => (
                <tr key={item.id} className="border-b text-sm">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 text-center">{item.channel}</td>
                  <td className="p-3 text-center">{item.audience}</td>
                  <td className="p-3 text-center">{item.status}</td>
                  <td className="p-3 text-center">{formatDate(item.created_at)}</td>
                  <td className="p-3 text-center"><button onClick={() => deleteNotification(item.id)} className="text-red-600">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => setPage((current) => Math.max(1, current - 1))} className="border px-3 py-1 rounded-lg">{"<"}</button>
          <span className="text-sm">Page {page} of {meta?.total_pages || 1}</span>
          <button onClick={() => setPage((current) => Math.min(meta?.total_pages || current, current + 1))} className="border px-3 py-1 rounded-lg">{">"}</button>
        </div>
      </div>
    </div>
  );
}
