"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import ChatWindow from "./ChatWindow";
import ConversationList from "./ConversationList";
import { getBookingMessages, getConversations, sendMessage, type ChatMessage, type Conversation } from "@/services/message.service";
import { getToken } from "@/services/api";

type MessageScope = "user" | "astrologer";

const filters = [
  { label: "All", value: "all" },
  { label: "Chat", value: "chat" },
  { label: "Audio Call", value: "audio_call" },
  { label: "Video Call", value: "video_call" },
] as const;

export default function MessagePageContent({ scope = "user" }: { scope?: MessageScope }) {
  const searchParams = useSearchParams();
  const requestedBookingId = searchParams.get("bookingId");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");

  useEffect(() => {
    getConversations(scope)
      .then((response) => {
        const rows = (response.data || []) as Conversation[];
        setConversations(rows);
        setActive(rows.find((item) => item.booking_id === requestedBookingId) || rows[0] || null);
      })
      .catch(() => undefined);
  }, [requestedBookingId, scope]);

  useEffect(() => {
    if (!active?.booking_id) {
      Promise.resolve().then(() => setMessages([]));
      return;
    }
    getBookingMessages(active.booking_id, scope)
      .then((response) => setMessages(response.data || []))
      .catch(() => setMessages([]));
  }, [active, scope]);

  useEffect(() => {
    if (!active?.booking_id) return;
    
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isMounted = true;
    
    const connect = () => {
      if (!isMounted) return;
      const token = getToken(scope);
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";
      const wsBase = apiBase.replace(/\/api\/v1$/, "").replace(/^http/, "ws");
      const wsUrl = `${wsBase}/ws/chat/${active.booking_id}${token ? `?token=${token}` : ""}`;
      
      ws = new WebSocket(wsUrl);
      
      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === "receive_message") {
            const newMsg = payload.data;
            setMessages((current) => {
              if (current.some((m) => m.id === newMsg.id)) return current;
              return [...current, newMsg];
            });
          } else if (payload.event === "message_status_update") {
            const update = payload.data;
            setMessages((current) =>
              current.map((m) => {
                if (m.id === update.message_id || (update.booking_id === active.booking_id && m.receiver_id === update.receiver_id)) {
                  return {
                    ...m,
                    delivery_status: update.delivery_status,
                    delivered_at: update.delivered_at || m.delivered_at,
                    read_at: update.read_at || m.read_at,
                    is_read: update.delivery_status === "read" ? true : m.is_read
                  };
                }
                return m;
              })
            );
          }
        } catch (err) {
          console.error("WebSocket message parse error:", err);
        }
      };
      
      ws.onclose = () => {
        if (!isMounted) return;
        console.log("WebSocket disconnected. Attempting to reconnect in 3s...");
        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      };
      
      ws.onerror = (err) => {
        console.error("WebSocket error:", err);
      };
    };

    connect();
    
    return () => {
      isMounted = false;
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [active?.booking_id, scope]);

  function handleSend(text: string) {
    if (!active?.id) return;
    const clientId = Math.random().toString(36).substring(2, 15);
    
    // Optimistic pending message in UI
    const pendingMsg: ChatMessage = {
      id: clientId,
      message: text,
      created_at: new Date().toISOString(),
      sender_id: "",
      receiver_id: active.receiver_id || active.id,
      pending: true,
    };
    setMessages((current) => [...current, pendingMsg]);
    
    sendMessage({ receiver_id: active.receiver_id || active.id, booking_id: active.booking_id, message: text }, scope)
      .then((response) => {
        // Swap optimistic message with official saved message
        setMessages((current) =>
          current.map((msg) => (msg.id === clientId ? response.data : msg))
        );
      })
      .catch(() => {
        // Remove optimistic message if api call failed
        setMessages((current) => current.filter((msg) => msg.id !== clientId));
      });
  }

  const filteredConversations = filter === "all"
    ? conversations
    : conversations.filter((conversation) => conversation.consultation_mode === filter);

  return (
    <main className="min-h-[calc(100svh-88px)] bg-[#fcfbff] px-2 py-2 sm:px-3 sm:py-3 lg:h-[calc(100svh-88px)] lg:overflow-hidden lg:px-2 lg:py-4s">
      <div className="mx-auto flex h-full max-w-full flex-col overflow-hidden bg-white lg:flex-row">
        <div className="w-full lg:w-[300px] lg:shrink-0 xl:w-[320px]">
          <div className="border-r border-[#ece8ef] bg-white px-4 py-3 lg:px-5">
            <div className="flex gap-2 overflow-x-auto">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  className={`shrink-0 rounded-full px-3 py-1 text-[12px] ${filter === item.value ? "bg-[#4898E1] text-white" : "bg-[#f4f2f7] text-[#4f4a57]"}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <ConversationList conversations={filteredConversations} activeId={active?.id} onSelect={setActive} />
        </div>
        <div className="min-w-0 flex-1">
          {conversations.length === 0 && scope === "user" ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 border-l border-[#ece8ef] bg-white px-6 text-center">
              <p className="text-[14px] text-[#737373]">No current chats. Please start a chat with an astrologer.</p>
              <Link href="/User/Astrologers" className="rounded-full bg-[#4898E1] px-5 py-2 text-sm text-white">
                Go to Astrologers
              </Link>
            </div>
          ) : (
            <ChatWindow conversation={active} messages={messages} onSend={handleSend} scope={scope} />
          )}
        </div>
      </div>
    </main>
  );
}
