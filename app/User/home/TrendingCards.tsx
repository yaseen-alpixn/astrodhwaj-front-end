import { Sparkles, Calculator, Gem, Flame } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
export default function TrendingCards() {
  const trendingServices: Array<{
    id: number;
    title: string;
    description: string;
    src: string;
    gradientClassName: string;
  }> = [
    {
      id: 1,
      title: "Kundli Generating",
      description: "Find Your Perfect Match.",
      src: "/images/Chakra.png",
      gradientClassName: "bg-[linear-gradient(135deg,#243fdd_0%,#2fc9b6_100%)]",
    },
    {
      id: 2,
      title: "Kundli Matching",
      description: "Find Your Perfect Match.",
      src: "/images/Chakra.png",
      gradientClassName: "bg-[linear-gradient(135deg,#a900c8_0%,#e10073_100%)]",
    },
    {
      id: 3,
      title: "Numerology",
      description: "Discover Your Destiny.",
      src: "/images/Numbers.png",
      gradientClassName: "bg-[linear-gradient(135deg,#b39c12_0%,#df245f_100%)]",
    },
  ];

  return (
    <section className="mt-10 pb-8 px-2 ml-3 sm:px-0 p-2">
      {/* HEADER */}
      <div className="flex items-center gap-1 text-[#171717]">
        <Flame className="h-5 w-5 text-[#7b1bc4]" strokeWidth={2} />
        <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
          Trending Services
        </h2>
      </div>

      {/* GRID */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {trendingServices.map((service) => {
          return (
            <article
              key={service.id}
              className={`${service.gradientClassName} rounded-[16px] h-[110px] md:h-[124px] w-full px-4 md:px-5 py-4 text-white shadow-[0_12px_28px_rgba(70,45,125,0.18)]`}
            >
              <Image
                src={service.src}
                alt={service.title + " icon"}
                width={18}
                height={18}
                className="object-contain "
              />

              <h3 className="mt-2 md:mt-3 text-[16px] font-semibold tracking-[-0.03em]">
                {service.title}
              </h3>

              <p className="mt-1 text-[12px] font-normal text-white/95">
                {service.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
