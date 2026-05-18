import Image from "next/image";
import { Bell, MicOff, PhoneOff, Search } from "lucide-react";

export default function AudioCall() {
  return (
    <main className="min-h-screen bg-white">
      <section className="min-h-[calc(100vh-89px)] bg-[linear-gradient(180deg,#3f065c_0%,#7310b5_38%,#3f065c_100%)] text-white">
        <div className="border-b border-white/6 bg-[#37064d] px-4 py-6 text-center sm:px-6 lg:px-8">
          <p className="text-[2rem] font-semibold leading-none tracking-[-0.04em]">
            00:25
          </p>
          <p className="mt-2 text-[1.15rem] text-white/80">₹25/Min</p>
        </div>

        <div className="flex min-h-[calc(100vh-193px)] flex-col justify-between px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <Image
                src="/images/AudioCallpicture.jpg"
                alt="Astrologer Priya Sharma"
                width={232}
                height={232}
                className="mx-auto h-[170px] w-[170px] rounded-full object-cover shadow-[0_18px_45px_rgba(0,0,0,0.22)] sm:h-[210px] sm:w-[210px] lg:h-[232px] lg:w-[232px]"
                unoptimized
              />

              <h2 className="mt-7 text-[2rem] font-semibold tracking-[-0.04em] sm:text-[2.45rem]">
                Astrologer Priya Sharma
              </h2>
              <p className="mt-2 text-[1.25rem] text-white/75 sm:text-[1.45rem]">
                Voice Call In Progress
              </p>
            </div>
          </div>

          <div className="border-t border-white/8 pt-6 text-center lg:pt-8">
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Mute microphone"
                className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur"
              >
                <MicOff className="h-7 w-7" strokeWidth={2.2} />
              </button>

              <button
                type="button"
                aria-label="End call"
                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#ea1205] text-white shadow-[0_14px_34px_rgba(234,18,5,0.35)]"
              >
                <PhoneOff className="h-7 w-7" strokeWidth={2.4} />
              </button>
            </div>

            <p className="mt-5 text-[1.1rem] text-white/78 sm:text-[1.2rem]">
              Session Cost: ₹25 • Remaining Balance: ₹0
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
