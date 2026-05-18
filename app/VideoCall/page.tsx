"use client";

import Image from "next/image";
import { MicOff, PhoneOff, VideoOff } from "lucide-react";

export default function VideoCall() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#3f065c] px-4 pb-8 sm:px-6 lg:px-8">
      {/* Top Timer Section */}
      <div className="w-full bg-[#3f065c] py-5 text-center text-white sm:py-6">
        <p className="text-2xl font-semibold sm:text-3xl">00:25</p>
        <p className="mt-1 text-base opacity-80 sm:text-lg">₹25/Min</p>
      </div>

      {/* Main Video Container */}
      <div className="relative w-full max-w-[1400px]">
        {/* Main Image */}
        <Image
          src="/images/VideoCallimage.jpg"
          alt="Astrologer Priya Sharma - video call"
          width={1440}
          height={641}
          className="h-[52vh] min-h-[280px] w-full rounded-[16px] object-cover object-[center_30%] sm:h-[58vh] sm:rounded-[20px] lg:min-h-[520px] lg:max-h-[641px]"
        />
        {/* Overlay Text */}
        <div className="absolute left-0 right-0 top-4 px-4 text-center text-white sm:top-6">
          <h2 className="text-xl font-semibold sm:text-3xl">
            Astrologer Priya Sharma
          </h2>
          <p className="opacity-80">Video Call In Progress</p>
        </div>

        {/* Small Image */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
          <Image
            src="/images/profile.svg"
            alt="Your profile"
            width={135}
            height={167}
            className="h-[96px] w-[76px] rounded-[12px] object-cover shadow-lg sm:h-[136px] sm:w-[110px] sm:rounded-[15px]"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3 sm:mt-12">
        <button className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white bg-white/20 p-3 sm:h-[65px] sm:w-[65px] sm:p-[15px]">
          <MicOff className="text-white" />
        </button>

        <button className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white bg-white/20 p-3 sm:h-[65px] sm:w-[65px] sm:p-[15px]">
          <VideoOff className="text-white" />
        </button>

        <button className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-white bg-red-600 p-3 sm:h-[65px] sm:w-[65px] sm:p-[15px]">
          <PhoneOff className="text-white" />
        </button>
      </div>

      {/* Bottom Text */}
      <p className="mt-5 text-center text-sm text-white opacity-80 sm:mt-6 sm:text-base">
        Session Cost: ₹25 • Remaining Balance: ₹0
      </p>
    </div>
  );
}
