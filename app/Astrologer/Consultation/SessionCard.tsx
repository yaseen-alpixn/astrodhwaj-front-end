import { Phone, Video, MessageCircle } from "lucide-react";

export default function SessionCard({
  id,
  name,
  time,
  duration,
  status,
  type,
  onEnd,
}: {
  id: string;
  name: string;
  time: string;
  duration: number;
  status: string;
  type: string;
  onEnd?: () => void;
}) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="h-auto w-full shadow-sm rounded-[15px] bg-white p-[15px] flex flex-col gap-3 sm:h-[117px] sm:flex-row sm:items-center sm:justify-between w-full ">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-[#0180D5] to-[#0040C1] text-white flex items-center justify-center font-bold">
          {initials || "U"}
        </div>

        <div>
          <p className="font-[DM_Sans] text-[16px] font-semibold capitalize">
            {name}
          </p>
          <p className="text-gray-500 text-[12px] font-normal">
            {time} • {duration} Min
          </p>

          <span className="text-[11px] font-medium capitalize">{type}</span>
        </div>
      </div>

      {/* Right Status */}
      <div className="flex items-center gap-3">
        {onEnd && (
          <button 
            onClick={onEnd}
            className="h-8 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition active:scale-95"
          >
            End Session
          </button>
        )}
        <span className="w-[80px] h-[22px] px-[10px] py-[3px] rounded-full bg-green-100 text-green-600 text-[11px] font-medium flex items-center justify-center capitalize">
          {status}
        </span>
      </div>
    </div>
  );
}
