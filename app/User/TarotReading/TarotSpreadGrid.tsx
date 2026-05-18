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
              className="relative overflow-hidden rounded-[18px] border-[5px] border-white bg-[#4898E1] shadow-[0_20px_50px_rgba(40,13,82,0.22)]"
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
              className="min-h-[180px] rounded-[18px] bg-[#4898E1] sm:min-h-[200px] lg:min-h-[412px]"
            />
          ),
        )}
      </div>

      <button
        type="button"
        className="inline-flex min-h-10 min-w-[120px] items-center justify-center rounded-[8px] bg-[#0D42AD] transition-transform hover:translate-y-[-1px] text-white"
      >
        Get Result
      </button>
    </section>
  );
}
