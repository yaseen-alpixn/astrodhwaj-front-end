import Image from "next/image";
import { Star } from "lucide-react";
import StatCard from "./StatCard";
import type { AstrologerProfile } from "@/services/astrologer.service";

export default function ProfileCard({ profile }: { profile: AstrologerProfile | null }) {
  const name = profile?.display_name || profile?.user?.full_name || "Dr. Priya Sharma";
  const avatar = profile?.user?.avatar_url || "/images/AudioCallpicture.jpg";
  const rating = profile?.rating || 4.8;
  const consultations = profile?.total_sessions || 2840;

  return (
    <div className="mt-2 flex w-full flex-col lg:flex-row items-center justify-evenly gap-3 rounded-[15px] bg-white p-[15px] shadow-lg">
      {/* Logo */}
      <div className="flex flex-col items-center gap-2 rounded-[10px] border p-3 min-w-[150px]">
        <Image
          src={avatar}
          alt={`${name} profile photo`}
          width={80}
          height={80}
          className="w-[80px] h-[80px] rounded-full object-cover"
        />

        {/* Name */}
        <p className="font-[DM_Sans] font-semibold text-[16px] leading-[100%] text-center capitalize mt-2">
          {name}
        </p>

        {/* Rating Row */}
        <div className="flex items-center gap-[3px] h-[21px]">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-[11px] font-medium">{rating}</span>
          <span className="text-gray-400 text-[12px] font-normal">
            ({consultations} consultations)
          </span>
        </div>
      </div>
      <StatCard 
        audioRate={profile?.per_minute_rate} 
        chatRate={profile?.chat_rate} 
        videoRate={profile?.video_rate} 
      />
    </div>
  );
}
