import Image from "next/image";
import { MicOff, PhoneOff } from "lucide-react";

export default function AudioCall() {
  return (
    <main className="min-h-screen overflow-hidden bg-white">
      <section className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#3f065c_0%,#7310b5_38%,#3f065c_100%)] text-white">
        {/* Top timer */}
        <div className="border-b border-white/10 bg-[#37064d] px-4 py-3 text-center sm:px-6">
          <p className="text-2xl font-semibold tracking-tight sm:text-3xl">
            00:25
          </p>
          <p className="mt-1 text-sm text-white/80 sm:text-base">₹25/Min</p>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between px-4 py-6 sm:px-8 lg:px-12">
          {/* Profile */}
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Image
                src="/images/AudioCallpicture.jpg"
                alt="Astrologer Priya Sharma"
                width={232}
                height={232}
                className="mx-auto h-36 w-36 rounded-full object-cover shadow-2xl sm:h-44 sm:w-44 lg:h-56 lg:w-56"
                unoptimized
              />

              <h2 className="mt-6 text-2xl font-semibold sm:text-3xl">
                Astrologer Priya Sharma
              </h2>

              <p className="mt-2 text-sm text-white/75 sm:text-base">
                Voice Call In Progress
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="border-t border-white/10 pt-6 text-center">
            <div className="flex items-center justify-center gap-5">
              <button
                type="button"
                aria-label="Mute microphone"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/20 backdrop-blur"
              >
                <MicOff className="h-6 w-6" />
              </button>

              <button
                type="button"
                aria-label="End call"
                className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-xl"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
            </div>

            <p className="mt-5 text-sm text-white/80 sm:text-base">
              Session Cost: ₹25 • Remaining Balance: ₹0
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
