"use client";

import Link from "next/link";
import { User, Star } from "lucide-react";

function WhoAreYou() {
  return (
    <div
      className="relative isolate flex h-svh items-center justify-center overflow-hidden px-5 py-4 sm:px-8 sm:py-5 lg:px-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(5, 15, 35, 0.8) 0%, rgba(30, 20, 60, 0.8) 100%), url('/images/login-bg.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Decorative overlay effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(99,102,241,0.2),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(168,85,247,0.2),transparent_50%)]" />

      <div className="relative z-10 mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 text-center sm:mb-7">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Who Are You?
          </h1>
          <p className="mt-2 text-base text-white/80">
            Choose your journey with AstroDhwaj
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          
          {/* User Card */}
          <div className="flex h-80 flex-col rounded-[24px] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0085FF]">
                <User size={32} className="text-white" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="mt-4 text-center text-xl font-bold text-gray-900">
              I am a User
            </h2>
            <p className="mt-1 text-center text-xs text-gray-600">
              Get Guidance & Unlock Your Destiny
            </p>

            {/* Features */}
            <ul className="mt-3 flex-1 space-y-1 text-gray-700 text-xs">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Get personalized readings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Connect with top astrologers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Access spiritual services</span>
              </li>
            </ul>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2.5">
              <Link
                href="/login/user"
                className="block w-full rounded-full bg-[#0085FF] py-2 text-center text-sm font-semibold text-white transition-all hover:bg-[#0070d6] active:scale-95 shadow-md"
              >
                Log In as User
              </Link>
              <div className="text-center text-xs text-gray-500 font-semibold">
                New seeker?{" "}
                <Link href="/signup/user" className="text-[#0085FF] hover:underline">
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          {/* Astrologer Card */}
          <div className="flex h-80 flex-col rounded-[24px] bg-white/95 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4c400]">
                <Star
                  size={32}
                  className="fill-[#f4c400] text-[#f4c400]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="mt-4 text-center text-xl font-bold text-gray-900">
              I am an Astrologer
            </h2>
            <p className="mt-1 text-center text-xs text-gray-600">
              Earn & Help Others To Find A Path.
            </p>

            {/* Features */}
            <ul className="mt-3 flex-1 space-y-1 text-gray-700 text-xs">
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Share your astrology expertise.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Set your own session pricing rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                <span>Build your client roster and consult.</span>
              </li>
            </ul>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2.5">
              <Link
                href="/login/astrologer"
                className="block w-full rounded-full bg-[#f4c400] py-2 text-center text-sm font-semibold text-gray-900 transition-all hover:bg-[#e0b000] active:scale-95 shadow-md"
              >
                Log In as Astrologer
              </Link>
              <div className="text-center text-xs text-gray-400 font-medium italic">
                Astrologer registrations are closed temporarily
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default WhoAreYou;
