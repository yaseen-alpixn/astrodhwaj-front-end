import Link from "next/link";
import { MessageSquareText, Phone, Radio, Video } from "lucide-react";

const consultationTypes = [
  {
    title: "Audio Call",
    description: "Connect via voice call",
    icon: Phone,
    cardClassName: "bg-[#edf4fd]",
    iconClassName: "text-[#2563eb]",
  },
  {
    title: "Video Call",
    description: "Face-to-face consultation",
    icon: Video,
    cardClassName: "bg-[#f5effa]",
    iconClassName: "text-[#8b1cf7]",
  },
  {
    title: "Chat",
    description: "Text-based guidance",
    icon: MessageSquareText,
    cardClassName: "bg-[#edf9f1]",
    iconClassName: "text-[#09a83e]",
  },
  {
    title: "Live Streaming",
    description: "Group sessions",
    icon: Radio,
    cardClassName: "bg-[#fbf0f1]",
    iconClassName: "text-[#f30f18]",
  },
];

function ConsultationTypes() {
  return (
    <section className="w-full bg-[linear-gradient(90deg,#f1e4ff_0%,#f8efe8_52%,#fff6be_100%)] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto ">
        <h2 className="text-center text-[2rem] font-medium tracking-[-0.05em] text-[#111111] sm:text-[2.6rem] lg:text-[3rem]">
          Choose Your Consultation Type
        </h2>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-4 xl:gap-6">
          {consultationTypes.map((type) => {
            const Icon = type.icon;

            const href =
              type.title === "Audio Call" ? "/AudioCall" :
              type.title === "Video Call" ? "/VideoCall" :
              type.title === "Chat" ? "/User/message" :
              type.title === "Live Streaming" ? "/User/home" : "#";

            return (
              <Link key={type.title} href={href}>
                <article
                  className={`flex min-h-[228px] flex-col items-center rounded-[20px] px-8 py-8 text-center ${type.cardClassName}`}
                >
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                    <Icon
                      className={type.iconClassName}
                      size={30}
                      strokeWidth={2.2}
                    />
                  </div>

                  <h3 className="mt-3 text-[1.5rem] font-medium tracking-[-0.04em] text-[#111111]">
                    {type.title}
                  </h3>

                  <p className="mt-1 text-[0.8rem] leading-relaxed text-[#3f3f46] sm:text-[1.15rem] md:whitespace-nowrap">
                    {type.description}
                  </p>
                </article>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ConsultationTypes;
