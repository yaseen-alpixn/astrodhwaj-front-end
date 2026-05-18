import Image from "next/image";

import { conversations } from "./data";

export default function ConversationList() {
  return (
    <section className="flex h-full min-h-0 flex-col gap-[10px] border-r border-[#ece8ef] bg-white px-4 lg:px-5">
      <div className="min-h-0 flex-1 overflow-y-auto py-3 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {conversations.map((conversation) => (
          <article
            key={conversation.id}
            className="flex items-center gap-3 border-b border-[#ece8ef] py-4 last:border-b-0"
          >
            <Image
              src="/images/profile.svg"
              alt={conversation.name}
              width={52}
              height={52}
              className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
              unoptimized
            />

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <h3 className="truncate text-[16px] font-semibold tracking-[-0.02em] text-[#171717]">
                  {conversation.name}
                </h3>

                {conversation.unread ? (
                  <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#4898E1]" />
                ) : conversation.time ? (
                  <span className="shrink-0 text-[12px] font-normal text-[#4f4a57]">
                    {conversation.time}
                  </span>
                ) : null}
              </div>

              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="truncate text-[13px] font-normal leading-[22px] text-[#737373]">
                  {conversation.preview}
                </p>

                {!conversation.unread && conversation.time ? (
                  <span className="shrink-0 text-[12px] font-normal text-transparent">
                    {conversation.time}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
