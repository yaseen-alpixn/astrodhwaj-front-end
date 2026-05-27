"use client";

import { Phone, SendHorizonal, Video } from "lucide-react";
import { FormEvent, useState } from "react";
import Link from "next/link";

import type { ChatMessage, Conversation } from "@/services/message.service";

type ChatWindowProps = {
  conversation?: Conversation | null;
  messages: ChatMessage[];
  onSend?: (text: string) => void;
  scope?: "user" | "astrologer";
};

export default function ChatWindow({ conversation, messages, onSend, scope = "user" }: ChatWindowProps) {
  const [text, setText] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value || !conversation) return;
    onSend?.(value);
    setText("");
  }

  return (
    <section className="flex h-full min-h-0 flex-col border-l border-[#ece8ef] bg-white">
      <header className="flex items-center justify-between gap-4 border-b border-[#f1ecf7] px-3 py-2 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E1F4FF] text-[18px] font-semibold text-[#4898E1]">
            {(conversation?.name || "A").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[#171717]">
              {conversation?.name || "No conversation selected"}
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-[#4f4a57]">
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[#171717]">
          {(!conversation?.consultation_mode || conversation.consultation_mode === "audio_call") && (
            <Link
              href={`/AudioCall?bookingId=${conversation?.booking_id || ""}`}
              aria-label="Call astrologer"
              className="p-1 hover:text-[#4898E1] transition-colors"
            >
              <Phone className="h-6 w-6" strokeWidth={2} />
            </Link>
          )}
          {(!conversation?.consultation_mode || conversation.consultation_mode === "video_call") && (
            <Link
              href={`/VideoCall?bookingId=${conversation?.booking_id || ""}`}
              aria-label="Video call astrologer"
              className="p-1 hover:text-[#4898E1] transition-colors"
            >
              <Video className="h-6 w-6" strokeWidth={2} />
            </Link>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[linear-gradient(180deg,#ffffff_0%,#fffefe_100%)] px-4 py-6 sm:px-5 sm:py-8 lg:px-6">
        {messages.map((message) => {
          const senderRole = message.metadata?.sender_role;
          const isUser = senderRole ? senderRole === scope : scope === "user";

          return (
            <div
              key={message.id}
              className={
                isUser
                  ? "ml-auto flex max-w-[84%] flex-col items-end"
                  : "max-w-[84%]"
              }
            >
              <div
                className={
                  isUser
                    ? "w-fit max-w-full min-w-[140px] rounded-[18px] rounded-br-[8px] bg-[#efd6ff] px-4 py-4 text-[13px] font-normal leading-[22px] text-[#171717] shadow-[0_8px_24px_rgba(122,30,177,0.08)] sm:min-w-[220px] lg:min-w-[320px]"
                    : "w-fit max-w-full min-w-[140px] rounded-[18px] rounded-bl-[8px] bg-[#E1F4FF] px-4 py-4 text-[13px] font-normal leading-[22px] text-[#171717] shadow-[0_8px_24px_rgba(17,17,17,0.04)] sm:min-w-[220px] lg:min-w-[320px]"
                }
              >
                {message.message}
              </div>
              <div className="mt-2 flex items-center justify-end gap-1 px-2 text-[12px] font-normal text-[#6c6672]">
                <span>
                  {message.created_at ? new Date(message.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
                </span>
                {isUser && (
                  <span className="ml-1 flex items-center">
                    {message.pending ? (
                      <span className="text-gray-400 text-[10px]" title="Sending">🕒</span>
                    ) : message.delivery_status === "read" || message.is_read ? (
                      <span className="text-[#4898E1] font-extrabold text-[12px]" title="Read">✓✓</span>
                    ) : message.delivery_status === "delivered" ? (
                      <span className="text-gray-400 font-extrabold text-[12px]" title="Delivered">✓✓</span>
                    ) : (
                      <span className="text-gray-400 text-[12px]" title="Sent">✓</span>
                    )}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-[13px] font-normal leading-[22px] text-[#737373]">
            No messages yet
          </p>
        )}
      </div>

      <footer className="mt-auto border-t border-[#f1ecf7] px-3 py-2 sm:px-6">
        <form onSubmit={submit} className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={!conversation}
            className="h-10 flex-1 rounded-full border border-black/20 bg-white px-5 text-base text-[#171717] outline-none placeholder:text-[#777]"
          />
          <button
            type="submit"
            aria-label="Send message"
            disabled={!conversation}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4898E1] text-white shadow-[0_12px_30px_rgba(119,23,197,0.26)]"
          >
            <SendHorizonal className="h-6 w-6" strokeWidth={2.6} />
          </button>
        </form>
      </footer>
    </section>
  );
}
