import { CalendarDays, Clock3, Globe2 } from "lucide-react";

export default function CourseHero() {
  return (
    <section className="overflow-hidden bg-gradient-to-b  from-[#0085FF] to-[#DD9A29] px-5 py-6 text-white sm:px-7 sm:py-7 lg:px-9 lg:py-8">
      <div className="max-w-4xl">
        <h2 className="max-w-3xl text-[18px] font-semibold tracking-[-0.04em]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </h2>

        <p className="mt-2 max-w-3xl text-[13px] font-normal leading-[22px] text-white/92">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris
        </p>

        <div className="mt-3 flex flex-wrap items-end gap-3 text-white">
          <div>
            <div className="flex items-end gap-2 leading-none">
              <span className="text-[20px] font-bold tracking-[-0.05em]">
                ₹299
              </span>
              <span className="pb-1 text-[12px] font-normal text-white/85 line-through">
                ₹500
              </span>
            </div>
            <p className="mt-1 text-[12px] font-normal text-white/88">
              (including all price)
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-3 text-[12px] font-normal text-white/96 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6">
          <span className="inline-flex items-center gap-2">
            <Globe2 className="h-[18px] w-[18px]" strokeWidth={2.1} />
            Hindi & English Both
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-[18px] w-[18px]" strokeWidth={2.1} />
            20 April 2026
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-[18px] w-[18px]" strokeWidth={2.1} />
            12:00 PM - 3:00 PM
          </span>
        </div>
      </div>
    </section>
  );
}
