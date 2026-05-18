import Image from "next/image";
import { Award, Play, Star, Users } from "lucide-react";

export default function CourseSidebarCard() {
  return (
    <aside className="rounded-[20px] h-2/5 border border-[#ece3f7] bg-white p-3  sm:p-5">
      <div className="relative overflow-hidden rounded-[22px]">
        <Image
          src="/images/couseOverview.png"
          alt="Course preview"
          width={440}
          height={220}
          className="h-[220px] w-full object-cover"
          priority
        />
      </div>

      <h3 className="mt-1 text-[1.4rem] font-semibold  tracking-[-0.04em] text-[#171717]">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      </h3>

      <p className="mt-1 text-[0.9rem] text-[#4b4b56]">
        Learn a practical and beginner-friendly approach to chart reading with
        structured lessons and live guidance.
      </p>

      <p className="mt-1 text-[0.9rem] font-medium text-[#25252b]">
        Created by <span className="font-semibold">AstroConnect</span>
      </p>

      <div className="mt-1 overflow-hidden rounded-[10px] border border-[#dbd3e8] bg-white">
        <div className="grid grid-cols-1 items-stretch divide-y divide-[#e9e1f2] sm:grid-cols-[100px_auto_1fr_1fr] sm:divide-x sm:divide-y-0">
          <div className="flex flex-col items-center justify-center bg-[linear-gradient(98deg,#dc9c2f_0%,#7914c8_100%)]  text-center text-white">
            <Image
              src="/images/Premium.png"
              alt="Premium badge"
              width={18}
              height={18}
              className="object-contain "
            />
            <span className="mt-1 text-sm font-medium">Premium</span>
          </div>

          <div className="flex items-center justify-center px-2 text-[#ff9d00]">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`top-${index}`}
                  className="h-3.5 w-3.5 fill-current"
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="text-[1.5rem] font-semibold leading-none tracking-[-0.04em] text-[#171717]">
              5.0
            </div>
            <div className="mt-1 flex justify-center gap-0.5 text-[#ff9d00]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="h-3.5 w-3.5 fill-current"
                  strokeWidth={1.6}
                />
              ))}
            </div>
            <div className="mt-1 text-[0.75rem] text-[#666674]">
              1,930 ratings
            </div>
          </div>

          <div className=" flex flex-col items-center mt-1 text-center text-[#171717]">
            <Image
              src="/images/Scholar.png"
              alt="Scholar icon - learners count"
              width={18}
              height={18}
              className="object-contain"
            />
            <div className="mt-1 text-[1rem] font-semibold leading-none">
              10,467
            </div>
            <div className="mt-1 text-[0.82rem] text-[#666674]">Learners</div>
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-4">
        <button
          type="button"
          className="inline-flex h-10 w-full items-center justify-center rounded-[16px] bg-[#7b18cb] text-[1rem] font-semibold text-white transition-colors hover:bg-[#6810b1]"
        >
          Buy Course
        </button>
        <button
          type="button"
          className="inline-flex h-10 w-full items-center justify-center rounded-[16px] border border-[#7b18cb] bg-white text-[1rem] font-semibold text-[#171717] transition-colors hover:bg-[#fbf7ff]"
        >
          Add To Cart
        </button>
      </div>
    </aside>
  );
}
