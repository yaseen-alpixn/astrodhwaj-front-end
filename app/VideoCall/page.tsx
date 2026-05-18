"use client";

import Image from "next/image";
import { MicOff, PhoneOff, VideoOff } from "lucide-react";

export default function VideoCall() {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-[#3f065c] px-4 py-3 sm:px-6 lg:px-8">
      {/* Top Timer */}
      <div className="py-2 text-center text-white sm:py-3">
        <p className="text-xl font-semibold sm:text-2xl lg:text-3xl">00:25</p>
        <p className="mt-1 text-sm opacity-80 sm:text-base">₹25/Min</p>
      </div>

      {/* Main Video */}
      <div className="relative flex-1 w-full max-w-[1400px] mx-auto">
        <Image
          src="/images/VideoCallimage.jpg"
          alt="Astrologer Priya Sharma - video call"
          width={1440}
          height={641}
          className="h-[42vh] min-h-[220px] w-full rounded-2xl object-cover sm:h-[48vh] lg:h-[60vh] object-[center_30%]"
        />

        {/* Overlay */}
        <div className="absolute inset-x-0 top-3 px-4 text-center text-white sm:top-5">
          <h2 className="text-lg font-semibold sm:text-2xl lg:text-3xl">
            Astrologer Priya Sharma
          </h2>
          <p className="text-sm opacity-80 sm:text-base">
            Video Call In Progress
          </p>
        </div>

        {/* Small Self View */}
        <div className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5">
          <Image
            src="/images/profile.svg"
            alt="Your profile"
            width={135}
            height={167}
            className="h-[78px] w-[62px]  object-cover shadow-lg sm:h-[110px] sm:w-[90px]"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex justify-center gap-3 sm:mt-6">
        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/20 sm:h-14 sm:w-14">
          <MicOff className="text-white" />
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-full border border-white bg-white/20 sm:h-14 sm:w-14">
          <VideoOff className="text-white" />
        </button>

        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 sm:h-14 sm:w-14">
          <PhoneOff className="text-white" />
        </button>
      </div>

      {/* Bottom Text */}
      <p className="mt-3 text-center text-xs text-white/80 sm:text-sm lg:text-base">
        Session Cost: ₹25 • Remaining Balance: ₹0
      </p>
    </div>
  );
}
