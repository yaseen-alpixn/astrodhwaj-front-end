import { Phone, Video, MessageCircle } from "lucide-react";

export default function QueueCard({ type }: any) {
  const iconMap: any = {
    call: <Phone />,
    video: <Video />,
    chat: <MessageCircle />,
  };

  return (
    <div className="mx-auto w-full shadow-sm rounded-[15px] bg-white p-[15px] flex flex-col justify-between gap-[15px] ">
      {/* Top */}
      <div className="flex gap-4 items-center">
        {/* Avatar */}
        <div className="w-[50px] h-[50px] px-[21px] py-[12px] rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white">
          RK
        </div>

        <div>
          <p className="font-[DM_Sans] text-[16px] font-semibold capitalize">
            Rahul Kumar
          </p>
          <p className="text-gray-500 text-[12px] font-normal">
            Career Guidance
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        <span className="min-w-[95px] h-[22px] px-[10px] py-[3px] rounded-full bg-yellow-100 text-yellow-700 text-[11px] font-medium">
          Waiting 2 Min
        </span>
        <span className="min-w-[90px] h-[22px] px-[10px] py-[3px] rounded-full bg-gray-200 text-[11px] font-medium">
          {type}
        </span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="h-[45px] w-full rounded-[10px] bg-green-600 text-white">
          Accept
        </button>
        <button className="h-[45px] w-full rounded-[10px] border border-red-500 text-red-500">
          Decline
        </button>
      </div>
    </div>
  );
}
