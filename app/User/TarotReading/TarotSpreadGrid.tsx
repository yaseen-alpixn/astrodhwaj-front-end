import Image from "next/image";

import { tarotSlots } from "@/app/User/TarotReading/tarotData";

export default function TarotSpreadGrid() {
  return (
    <section className="space-y-6">
      <h2 className="text-center text-[20px] font-bold tracking-[-0.03em] text-[#222126]">
        Focus On Your Question And Let Your Intuition Guide You
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
        {tarotSlots.map((slot) =>
          slot.imageSrc ? (
            <article
              key={slot.id}
              className="relative overflow-hidden rounded-[18px] border-[5px] border-white bg-[#150a23] shadow-[0_20px_50px_rgba(40,13,82,0.22)]"
            >
              <Image
                src={slot.imageSrc}
                alt={slot.imageAlt ?? slot.title ?? "Tarot card"}
                width={300}
                height={500}
                className="h-full w-full object-cover"
                priority={slot.id <= 5}
              />
            </article>
          ) : (
            <div
              key={slot.id}
              aria-hidden="true"
              className="min-h-[180px] rounded-[18px] bg-[linear-gradient(180deg,#2478bc_0%,#6d0bd6_100%)] shadow-[0_16px_40px_rgba(52,31,112,0.12)] sm:min-h-[200px] lg:min-h-[412px]"
            />
          ),
        )}
      </div>

      <button
        type="button"
        className="inline-flex min-h-10 min-w-[120px] items-center justify-center rounded-[8px] bg-[linear-gradient(90deg,#7a19c1_0%,#5c0ed5_100%)] px-6 py-2.5 text-[13px] font-medium text-white shadow-[0_14px_30px_rgba(93,20,194,0.26)] transition-transform hover:translate-y-[-1px]"
      >
        Get Result
      </button>
    </section>
  );
}
