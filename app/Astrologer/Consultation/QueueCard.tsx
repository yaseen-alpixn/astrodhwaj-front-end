import { Phone, Video, MessageCircle } from "lucide-react";

type QueueCardProps = {
  id: string;
  name: string;
  type: string;
  onAccept: () => void;
  onDecline: () => void;
};

export default function QueueCard({
  id,
  name,
  type,
  onAccept,
  onDecline,
}: QueueCardProps) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="mx-auto w-full shadow-sm rounded-[15px] bg-white p-[15px] flex flex-col justify-between gap-[15px] ">
      {/* Top */}
      <div className="flex gap-4 items-center">
        {/* Avatar */}
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#0180D5] to-[#0040C1] flex items-center justify-center text-white font-bold">
          {initials || "U"}
        </div>

        <div>
          <p className="font-[DM_Sans] text-[16px] font-semibold capitalize">
            {name}
          </p>
          <p className="text-gray-500 text-[12px] font-normal">
            Consultation Request
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        <span className="min-w-[95px] h-[22px] px-[10px] py-[3px] rounded-full bg-yellow-100 text-yellow-700 text-[11px] font-medium text-center">
          Waiting in Queue
        </span>
        <span className="min-w-[90px] h-[22px] px-[10px] py-[3px] rounded-full bg-gray-200 text-[11px] font-medium text-center">
          {type}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button 
          onClick={onAccept}
          className="h-[45px] w-full rounded-[10px] bg-green-600 text-white font-semibold transition active:scale-[0.98]"
        >
          Accept
        </button>
        <button 
          onClick={onDecline}
          className="h-[45px] w-full rounded-[10px] border border-red-500 text-red-500 font-semibold transition active:scale-[0.98]"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
