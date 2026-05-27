"use client";

import { FormEvent, useEffect, useMemo, useState, useRef } from "react";
import { SendHorizonal } from "lucide-react";
import { formatDate } from "@/services/api";
import {
  createSupportTicket,
  getRoleSupportSocket,
  getSupportTicket,
  listSupportTickets,
  replySupportTicket,
  type SupportScope,
  type SupportTicket,
  type SupportTicketMessage,
} from "@/services/support.service";

const statuses: Record<string, string> = {
  open: "OPEN",
  in_progress: "IN PROGRESS",
  resolved: "RESOLVED",
  closed: "CLOSED",
  reopened: "REOPENED",
};

const statusColors: Record<string, string> = {
  open: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
  closed: "bg-gray-100 text-gray-600 border-gray-200",
  reopened: "bg-purple-50 text-purple-700 border-purple-200",
};

const formatDateTime = (value: string | undefined | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function SupportTicketsPage({ scope }: { scope: SupportScope }) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [active, setActive] = useState<SupportTicket | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [connection, setConnection] = useState("Connecting");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const title = useMemo(() => scope === "astrologer" ? "Astrologer Support" : "Support Tickets", [scope]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    listSupportTickets(scope)
      .then((response) => {
        const rows = response.data || [];
        setTickets(rows);
        if (rows[0]) setActive(rows[0]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load support tickets"));
  }, [scope]);

  useEffect(() => {
    if (!active?.id) return;
    getSupportTicket(active.id, scope)
      .then((response) => {
        setActive(response.data);
        setMessages(response.data.chat_messages || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load ticket"));
  }, [active?.id, scope]);

  useEffect(() => {
    if (!active?.id) return;
    const socket = getRoleSupportSocket(scope);
    const join = () => {
      setConnection("Connected");
      socket.emit("join_ticket_room", { ticket_id: active.id });
    };
    const onDisconnect = () => setConnection("Reconnecting");
    const onMessage = (payload: SupportTicketMessage) => {
      setMessages((current) => {
        const pendingIndex = current.findIndex(
          (item) => item.pending && item.message === payload.message && item.sender_type === payload.sender_type
        );
        if (pendingIndex > -1) {
          return current.map((item, idx) => idx === pendingIndex ? payload : item);
        }
        return current.some((item) => item.id === payload.id) ? current : [...current, payload];
      });
    };
    const onJoined = (payload: { messages?: SupportTicketMessage[] }) => {
      if (payload.messages) setMessages(payload.messages);
      socket.emit("read_receipt", { ticket_id: active.id });
    };
    socket.on("connect", join);
    socket.on("disconnect", onDisconnect);
    socket.on("ticket_message", onMessage);
    socket.on("receive_ticket_message", onMessage);
    socket.on("ticket_joined", onJoined);
    if (socket.connected) {
      join();
    } else {
      socket.connect();
    }
    return () => {
      socket.emit("leave_ticket_room", { ticket_id: active.id });
      socket.off("connect", join);
      socket.off("disconnect", onDisconnect);
      socket.off("ticket_message", onMessage);
      socket.off("receive_ticket_message", onMessage);
      socket.off("ticket_joined", onJoined);
    };
  }, [active?.id, scope]);

  function createTicket(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError("Subject and message are required");
      return;
    }
    createSupportTicket({ subject, category, priority, message: description }, scope)
      .then((response) => {
        setTickets((current) => [response.data, ...current]);
        setActive(response.data);
        setSubject("");
        setDescription("");
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to create ticket"));
  }

  function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active?.id || !reply.trim()) return;
    const text = reply.trim();
    const clientId = crypto.randomUUID();
    setMessages((current) => [...current, { client_id: clientId, sender_type: scope, message: text, created_at: new Date().toISOString(), pending: true }]);
    setReply("");
    replySupportTicket(active.id, text, scope)
      .then((response) => {
        setMessages((current) => current.map((item) => item.client_id === clientId ? response.data : item));
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to send reply");
        setMessages((current) => current.filter((item) => item.client_id !== clientId));
      });
  }

  return (
    <main className="min-h-[calc(100svh-88px)] bg-[#fcfbff] p-4">
      <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[360px_1fr]">
        <section className="rounded-xl bg-white p-4 shadow-sm">
          <h1 className="text-[22px] font-semibold text-[#171717]">{title}</h1>
          <p className="mt-1 text-sm text-[#737373]">Create and track your support requests.</p>

          <form onSubmit={createTicket} className="mt-5 space-y-3">
            <input value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" className="h-10 w-full rounded-lg border px-3 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <select value={category} onChange={(event) => setCategory(event.target.value)} className="h-10 rounded-lg border px-3 text-sm">
                <option value="general">General</option>
                <option value="billing">Billing</option>
                <option value="booking">Booking</option>
                <option value="payments">Payments</option>
                <option value="technical">Technical</option>
              </select>
              <select value={priority} onChange={(event) => setPriority(event.target.value)} className="h-10 rounded-lg border px-3 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the issue" className="min-h-24 w-full rounded-lg border px-3 py-2 text-sm" />
            <button className="rounded-lg bg-[#4898E1] px-4 py-2 text-sm text-white">Create Ticket</button>
          </form>

          {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <div className="mt-5 space-y-2">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                onClick={() => setActive(ticket)}
                className={`w-full rounded-lg border px-3 py-3 text-left transition-colors ${active?.id === ticket.id ? "border-[#4898E1] bg-[#E8F4FF]" : "bg-white hover:bg-gray-50"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm font-semibold">{ticket.ticket_no || ticket.subject}</span>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-[11px] font-medium border ${statusColors[ticket.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                    {statuses[ticket.status] || ticket.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-[#737373]">{ticket.subject}</p>
              </button>
            ))}
            {tickets.length === 0 && <p className="py-4 text-sm text-[#737373]">No support tickets yet</p>}
          </div>
        </section>

        <section className="flex min-h-[620px] flex-col rounded-xl bg-white shadow-sm">
          <header className="border-b p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{active?.subject || "Select a ticket"}</h2>
                <p className="text-xs text-[#737373]">{active ? `${active.ticket_no || active.id} - ${formatDateTime(active.created_at)}` : connection}</p>
              </div>
              {active && (
                <span className={`rounded-full px-3 py-1 text-xs font-medium border ${statusColors[active.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                  {statuses[active.status] || active.status}
                </span>
              )}
            </div>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 flex flex-col">
            {messages.map((item, index) => {
              const own = item.sender_type === scope;
              return (
                <div key={item.id || item.client_id || index} className={`${own ? "self-end bg-[#E8F4FF]" : "self-start bg-gray-100"} max-w-[78%] rounded-xl px-4 py-3 border border-transparent`}>
                  <p className="text-sm text-[#171717]">{item.message}</p>
                  <p className="mt-1 text-[11px] text-[#737373]">{item.pending ? "Sending..." : formatDateTime(item.created_at)}</p>
                </div>
              );
            })}
            {active && messages.length === 0 && <p className="text-sm text-[#737373]">No replies yet</p>}
            {!active && <p className="text-sm text-[#737373]">Choose a ticket to view the conversation.</p>}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendReply} className="flex items-center gap-3 border-t p-4">
            <input
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              disabled={!active}
              placeholder={active ? "Type your reply..." : "Select a ticket to reply"}
              className="h-11 flex-1 rounded-full border px-4 text-sm outline-none focus:border-[#4898E1] focus:ring-1 focus:ring-[#4898E1] disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            />
            <button
              disabled={!active}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#4898E1] text-white hover:bg-[#3b82c4] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <SendHorizonal className="h-5 w-5" />
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
