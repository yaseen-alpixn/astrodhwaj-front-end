import Image from "next/image";
import { Star } from "lucide-react";

export default function ProfileCard() {
  return (
    <div className="mt-2 flex h-[170px] w-full flex-col items-center justify-center gap-3 rounded-[15px] bg-white p-[15px] shadow-lg">
      {/* Logo */}
      <Image
        src="/images/AudioCallpicture.jpg"
        alt="Dr. Priya Sharma profile photo"
        width={80}
        height={80}
        className="w-[80px] h-[80px] rounded-full object-cover"
      />

      {/* Name */}
      <p className="font-[DM_Sans] font-semibold text-[16px] leading-[100%] text-center capitalize">
        Dr.Priya Sharma
      </p>

      {/* Rating Row */}
      <div className="flex items-center gap-[3px] h-[21px]">
        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        <span className="text-[11px] font-medium">4.8</span>
        <span className="text-gray-400 text-[12px] font-normal">(2840 consultations)</span>
      </div>
    </div>
  );
}
