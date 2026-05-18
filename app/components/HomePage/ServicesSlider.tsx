"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const slides = [
  {
    title: "Numerology",
    image: "/images/numerology.svg",
    description: "Understand the patterns and purpose hidden in your numbers.",
  },
  {
    title: "Tarot Reading",
    image: "/images/tarot-reading.svg",
    description: "Discover your future through ancient tarot card wisdom",
  },
  {
    title: "Astrology",
    image: "/images/astrology.svg",
    description:
      "Decode planetary insights for clarity in life and relationships.",
  },
];

function mod(index: number, length: number) {
  return (index + length) % length;
}

function ServicesSlider() {
  const [activeIndex, setActiveIndex] = useState(1);

  const previousIndex = mod(activeIndex - 1, slides.length);
  const nextIndex = mod(activeIndex + 1, slides.length);

  return (
    <section className="w-full bg-white px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto ">
        <h2 className="text-center text-2xl font-medium tracking-[-0.04em] text-[#111111] sm:text-3xl">
          Our Services
        </h2>

        <div className="mt-5 grid items-start gap-8 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:gap-6">
          <article className="flex flex-col items-center text-center">
            <div className="relative h-[320px] w-full max-w-[270px] overflow-hidden rounded-[18px]">
              <Image
                src={slides[previousIndex].image}
                alt={slides[previousIndex].title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-4 text-[1.05rem] font-medium text-[#171717] sm:text-[1.2rem]">
              {slides[previousIndex].title}
            </h3>
          </article>

          <article className="flex flex-col items-center pt-8 text-center sm:pt-10">
            <div className="relative h-[350px] w-full max-w-[360px] overflow-hidden rounded-[20px] sm:h-[420px] sm:max-w-[420px]">
              <Image
                src={slides[activeIndex].image}
                alt={slides[activeIndex].title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <h3 className="mt-4 text-[1.5rem] font-medium text-[#111111] sm:text-[1.9rem]">
              {slides[activeIndex].title}
            </h3>
            <p className="mt-2 max-w-[340px] text-balance text-sm leading-relaxed text-[#555555] sm:text-[1rem]">
              {slides[activeIndex].description}
            </p>
          </article>

          <article className="flex flex-col items-center text-center">
            <div className="relative h-[320px] w-full max-w-[270px] overflow-hidden rounded-[18px]">
              <Image
                src={slides[nextIndex].image}
                alt={slides[nextIndex].title}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-4 text-[1.05rem] font-medium text-[#171717] sm:text-[1.2rem]">
              {slides[nextIndex].title}
            </h3>
          </article>
        </div>

        <div className="mt-4 flex justify-center gap-3 lg:mt-6 lg:justify-end">
          <button
            type="button"
            aria-label="Previous service"
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#d7d7d7] text-[#171717] transition-colors hover:bg-[#f5f5f5]"
            onClick={() =>
              setActiveIndex((current) => mod(current - 1, slides.length))
            }
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            aria-label="Next service"
            className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#d7d7d7] text-[#171717] transition-colors hover:bg-[#f5f5f5]"
            onClick={() =>
              setActiveIndex((current) => mod(current + 1, slides.length))
            }
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ServicesSlider;
