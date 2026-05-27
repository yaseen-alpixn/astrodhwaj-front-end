"use client";

import { X, Paperclip } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminApi, formatDate, titleCase } from "../../api";
import { getSupportSocket } from "../../supportSocket";

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

type TicketMessage = {
  id?: string;
  client_id?: string;
  sender_type?: string;
  message: string;
  attachments?: { url: string; name: string }[];
  created_at?: string;
  pending?: boolean;
  read_by?: string[];
};

type AdminUser = {
  id: string;
  full_name: string;
  email: string;
};

type TicketDetails = {
  id: string;
  ticket_no: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  created_at?: string;
  metadata?: { user_name?: string; user_email?: string; description?: string };
  assigned_to?: string;
  assigned_admin?: AdminUser | null;
  chat_messages?: TicketMessage[];
  requester_code?: string;
  requester_type?: string;
  requester_history?: Array<{
    id: string;
    ticket_no?: string;
    subject: string;
    status: string;
    created_at?: string;
    chat_messages?: TicketMessage[];
  }>;
};

export default function TicketDetailsModal({
  ticketId,
  onClose,
}: {
  ticketId?: string;
  onClose: () => void;
}) {
  const [ticket, setTicket] = useState<TicketDetails | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [connection, setConnection] = useState("Connecting");
  const [error, setError] = useState("");
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [attachments, setAttachments] = useState<{ url: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!ticketId) return;
    adminApi<TicketDetails>(`/admin/support-tickets/${ticketId}`)
      .then((response) => {
        setTicket(response.data);
        setMessages(response.data.chat_messages || []);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load ticket"));
    adminApi<AdminUser[]>("/admin/admins")
      .then((response) => setAdmins(response.data || []))
      .catch(() => setAdmins([]));

    const socket = getSupportSocket();
    const onConnect = () => {
      setConnection("Connected");
      socket.emit("join_ticket_room", { ticket_id: ticketId });
    };
    const onDisconnect = () => setConnection("Reconnecting");
    const onMessage = (payload: TicketMessage) => {
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
    const onAck = (payload: { client_id?: string; message?: TicketMessage }) => {
      if (!payload.message) return;
      setMessages((current) => current.map((item) => item.client_id === payload.client_id ? payload.message as TicketMessage : item));
    };
    const onJoined = (payload: { messages?: TicketMessage[] }) => {
      if (payload.messages) setMessages(payload.messages);
      socket.emit("read_receipt", { ticket_id: ticketId });
    };
    const onTyping = (payload: { is_typing?: boolean }) => setTyping(Boolean(payload.is_typing));
    const onRead = () => setMessages((current) => current.map((item) => ({ ...item, pending: false })));
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("ticket_message", onMessage);
    socket.on("receive_ticket_message", onMessage);
    socket.on("message_ack", onAck);
    socket.on("ticket_joined", onJoined);
    socket.on("typing", onTyping);
    socket.on("read_receipt", onRead);
    if (socket.connected) {
      onConnect();
    } else {
      socket.connect();
    }
    return () => {
      socket.emit("leave_ticket_room", { ticket_id: ticketId });
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("ticket_message", onMessage);
      socket.off("receive_ticket_message", onMessage);
      socket.off("message_ack", onAck);
      socket.off("ticket_joined", onJoined);
      socket.off("typing", onTyping);
      socket.off("read_receipt", onRead);
    };
  }, [ticketId]);

  const sendMessage = () => {
    if (!ticketId || !message.trim()) return;
    const clientId = crypto.randomUUID();
    const text = message;
    const optimistic = { client_id: clientId, sender_type: "admin", message: text, attachments, created_at: new Date().toISOString(), pending: true };
    setMessages((current) => [...current, optimistic]);
    setMessage("");
    setAttachments([]);
    adminApi<TicketMessage>(`/admin/support-tickets/${ticketId}/reply`, { method: "POST", body: JSON.stringify({ message: text, attachments }) })
      .then((response) => setMessages((current) => current.map((item) => item.client_id === clientId ? { ...response.data, client_id: clientId } : item)))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to send reply");
        setMessages((current) => current.filter((item) => item.client_id !== clientId));
      });
  };

  const uploadAttachment = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await adminApi<{ url: string }>("/upload/document", { method: "POST", body: form });
    setAttachments((current) => [...current, { url: response.data.url, name: file.name }]);
  };

  const updateStatus = async (value: string) => {
    if (!ticketId) return;
    if (value === "closed") {
      await adminApi(`/admin/support-tickets/${ticketId}/close`, { method: "POST" });
    } else if (value === "reopened") {
      await adminApi(`/admin/support-tickets/${ticketId}/reopen`, { method: "POST" });
    } else {
      await adminApi(`/admin/support-tickets/${ticketId}`, { method: "PATCH", body: JSON.stringify({ status: value }) });
    }
    setTicket((current) => current ? { ...current, status: value } : current);
  };

  const assignAdmin = async (adminId: string) => {
    if (!ticketId || !adminId) return;
    await adminApi(`/admin/support-tickets/${ticketId}/assign`, { method: "POST", body: JSON.stringify({ admin_id: adminId }) });
    const admin = admins.find((item) => item.id === adminId) || null;
    setTicket((current) => current ? { ...current, assigned_to: adminId, assigned_admin: admin } : current);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[90vh] w-[min(1000px,95vw)] flex-col overflow-hidden rounded-xl bg-white font-[DM_Sans] shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{ticket?.ticket_no || "Ticket"}</h2>
            {ticket && (
              <span className={`rounded-full px-3 py-1 text-sm font-medium border ${statusColors[ticket.status] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
                {titleCase(ticket.status)}
              </span>
            )}
            {!ticket && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500 border border-gray-200">
                {connection}
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 transition-colors">
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="rounded-xl bg-gray-50 border p-4 shadow-sm">
            <p className="font-semibold text-lg text-gray-900">{ticket?.subject || "Loading ticket..."}</p>
            <p className="text-sm text-gray-600 mt-1">
              {error || ticket?.metadata?.description || "Conversation and ticket activity will appear here."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 text-sm sm:grid-cols-2 bg-white shadow-sm">
            <div>
              <p className="text-gray-400 font-medium text-[11px] tracking-wider uppercase mb-1">USER DETAILS</p>
              <p className="font-semibold text-gray-900">{ticket?.metadata?.user_name || "-"}</p>
              <p className="text-gray-600">{ticket?.metadata?.user_email || "-"}</p>
              <p className="text-gray-600 font-mono text-xs mt-0.5">{ticket?.requester_code || "-"}</p>
            </div>

            <div>
              <p className="text-gray-400 font-medium text-[11px] tracking-wider uppercase mb-1">TICKET META</p>
              <p className="text-gray-700">
                Priority:{" "}
                <span className={`font-semibold ${
                  ticket?.priority === "high" ? "text-red-600" :
                  ticket?.priority === "medium" ? "text-amber-600" :
                  ticket?.priority === "low" ? "text-green-600" : "text-gray-600"
                }`}>
                  {titleCase(ticket?.priority)}
                </span>
              </p>
              <p className="text-gray-700">Category: {ticket?.category ? titleCase(ticket.category) : "-"}</p>
              <p className="text-gray-700">Assigned To: {ticket?.assigned_admin?.full_name || "Support Team"}</p>
              <p className="text-gray-500 text-xs mt-1">Created: {formatDateTime(ticket?.created_at)}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-lg text-gray-900">Conversation History</h3>
            <div className="space-y-4 flex flex-col">
              {messages.length === 0 && <p className="text-sm text-gray-500 py-4 text-center">No messages yet</p>}
              {messages.map((item, index) => (
                <div key={item.id || item.client_id || index} className={`${item.sender_type === "admin" ? "self-end bg-[#E8F4FF]" : "self-start bg-[#4898E1]/10"} max-w-[78%] rounded-xl p-4 border border-transparent flex flex-col`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-7 w-7 flex items-center justify-center rounded-full bg-[#4898E1] text-white text-xs font-semibold">
                      {item.sender_type === "admin" ? "A" : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-gray-800">{item.sender_type === "admin" ? "Support Team" : ticket?.metadata?.user_name || "User"}</p>
                      <p className="text-[10px] text-gray-500">{formatDateTime(item.created_at)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{item.message}</p>
                  {(item.attachments || []).map((attachment) => (
                    <a key={attachment.url} href={attachment.url} target="_blank" className="mt-2 block text-xs text-[#4898E1] hover:underline">
                      {attachment.name || "Attachment"}
                    </a>
                  ))}
                  {item.pending && <p className="mt-1 text-[10px] text-gray-500 italic">Sending...</p>}
                </div>
              ))}
              {typing && <p className="text-xs text-gray-400 italic self-start ml-2">User is typing...</p>}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {(ticket?.requester_history || []).length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold text-lg text-gray-900">Past Tickets From This Requester</h3>
              <div className="space-y-3">
                {ticket?.requester_history?.map((item) => (
                  <div key={item.id} className="rounded-xl border p-3 text-sm bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-gray-900">{item.ticket_no || item.subject}</p>
                      <span className={`rounded-full px-2 py-1 text-[11px] font-medium border ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>
                        {titleCase(item.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-gray-700">{item.subject}</p>
                    <p className="mt-1 text-xs text-gray-500">{formatDateTime(item.created_at)} - {(item.chat_messages || []).length} messages</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 border-t bg-white p-4 space-y-3">
          <textarea
            placeholder="Type message here..."
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              if (ticketId) getSupportSocket().emit("typing", { ticket_id: ticketId, is_typing: true });
            }}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#4898E1] focus:border-[#4898E1] transition-all min-h-[60px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <input ref={fileInputRef} type="file" className="hidden" onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadAttachment(file).catch((err) => setError(err instanceof Error ? err.message : "Upload failed"));
              event.currentTarget.value = "";
            }} />
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Paperclip size={16} />
              {attachments.length ? `${attachments.length} Attached` : "Attach File"}
            </button>

            <div className="flex flex-wrap gap-2 sm:gap-3">
              <select value={ticket?.assigned_to || ""} onChange={(event) => assignAdmin(event.target.value).catch((err) => setError(err instanceof Error ? err.message : "Assign failed"))} className="rounded-md border px-3 py-1.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4898E1]">
                <option value="">Assign Admin</option>
                {admins.map((admin) => <option key={admin.id} value={admin.id}>{admin.full_name}</option>)}
              </select>

              <select value={ticket?.status || "in_progress"} onChange={(event) => updateStatus(event.target.value).catch((err) => setError(err instanceof Error ? err.message : "Status update failed"))} className="rounded-md border px-3 py-1.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#4898E1]">
                <option value="in_progress">Mark as In Progress</option>
                <option value="resolved">Mark as Resolved</option>
                <option value="closed">Close Ticket</option>
                <option value="reopened">Reopen</option>
              </select>

              <button onClick={sendMessage} className="rounded-md bg-[#4898E1] px-5 py-1.5 text-xs sm:text-sm text-white hover:bg-[#3b82c4] transition-colors">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
