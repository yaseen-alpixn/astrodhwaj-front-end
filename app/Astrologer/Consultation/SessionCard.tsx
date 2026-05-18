import { Phone, Video, MessageCircle } from "lucide-react";

export default function SessionCard({
  status,
  type,
}: {
  status: string;
  type: string;
}) {
  const iconMap: any = {
    call: <Phone />,
    video: <Video />,
    chat: <MessageCircle />,
  };

  return (
    <div className="h-auto w-full shadow-sm rounded-[15px] bg-white p-[15px] flex flex-col gap-3 sm:h-[117px] sm:flex-row sm:items-center sm:justify-between w-full ">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] px-[21px] py-[12px] rounded-full bg-gradient-to-r from-[#0180D5] to-[#0040C1] text-white flex items-center justify-center">
          RK
        </div>

        <div>
          <p className="font-[DM_Sans] text-[16px] font-semibold capitalize">
            Rahul Kumar
          </p>
          <p className="text-gray-500 text-[12px] font-normal">
            10:30 AM • 30 Min
          </p>

          <span className="text-[11px] font-medium capitalize">{type}</span>
        </div>
      </div>

      {/* Right Status */}
      <span className="w-[80px] h-[22px] px-[10px] py-[3px] rounded-full bg-green-100 text-green-600 text-[11px] font-medium flex items-center justify-center">
        {status}
      </span>
    </div>
  );
}
