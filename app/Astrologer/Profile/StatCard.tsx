import { Phone, MessageCircle, Video } from "lucide-react";

const cardsdata = [
  { icon: Phone, time: "₹25/min", type: "Audio Call" },
  { icon: MessageCircle, time: "₹18/min", type: "Chat" },
  { icon: Video, time: "₹30/min", type: "Video Call" },
];

export default function StatCard() {
  return (
    <div className="grid grid-cols-3  gap-10 lg:gap-4">
      {cardsdata.map((card, index) => {
        const Icon = card.icon;

        return (
          <div
            key={index}
            className=" min-h-[160px] rounded-[10px] border bg-gradient-to-r from-yellow-100 to-[#4898E1]/10 p-4 flex flex-col items-center justify-center gap-2 px-8"
          >
            <Icon className="w-5 h-5 text-[#4898E1]" />

            <p className="font-semibold text-[16px] text-center">{card.time}</p>

            <p className="text-[12px] text-center text-[#4898E1]">
              {card.type}
            </p>
          </div>
        );
      })}
    </div>
  );
}
