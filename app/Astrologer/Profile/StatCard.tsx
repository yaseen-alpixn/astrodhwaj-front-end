import { Phone, MessageCircle, Video } from "lucide-react";
const cardsdata = [
  { icon: Phone, time: "₹25/min", type: "Audio Call" },
  { icon: MessageCircle, time: "₹18/min", type: "Chat" },
  { icon: Video, time: "₹30/min", type: "Video Call" },
];

export default function StatCard() {
  return (
    <div className="m-2 grid grid-cols-1 sm:grid-cols-2 gap-4 lg:grid-cols-3">
      {cardsdata.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="h-[112px] w-full rounded-[10px] border bg-gradient-to-r from-yellow-100 to-purple-200 p-[15px] flex flex-col items-center justify-center gap-2"
          >
            <Icon className="w-[20px] h-[20px] text-green-500" />
            <p className="font-[DM_Sans] font-semibold text-[16px] text-center capitalize">
              {card.time}
            </p>

            <p className="font-[DM_Sans] font-normal text-[12px] text-center capitalize text-gray-500">
              {card.type}
            </p>
          </div>
        );
      })}
    </div>
  );
}
