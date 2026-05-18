"use client";

import Image from "next/image";

const services = [
  {
    title: "Tarot Reading",
    src: "/images/Sun.png",
    bg: "bg-gradient-to-r from-green-500 to-emerald-400",
  },
  {
    title: "Astrology",
    src: "/images/Chakra.png",
    bg: "bg-gradient-to-r from-indigo-700 to-cyan-500",
  },
  {
    title: "Numerology",
    src: "/images/Calculator.png",
    bg: "bg-gradient-to-r from-yellow-600 to-pink-600",
  },
  {
    title: "Palmistry",
    src: "/images/Palm.png",
    bg: "bg-gradient-to-r from-cyan-400 to-teal-600",
  },
  {
    title: "Reiki Healing",
    src: "/images/Diamond.png",
    bg: "bg-gradient-to-r from-blue-600 to-indigo-600",
  },
  {
    title: "Vastu",
    src: "/images/Home3.png",
    bg: "bg-gradient-to-r from-[#4898E1] to-pink-600",
  },
];

export default function OurServices() {
  return (
    <section className="w-full bg-white px-4 py-6 rounded-xl mt-5 xl:mt-0 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Image
          src="/images/servicesicon.png"
          alt="Our services section icon"
          width={18}
          height={18}
          className="object-contain"
        />
        <h5 className="text-lg sm:text-xl font-semibold text-black">
          Our Services
        </h5>
      </div>

      {/* Services Grid */}
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-2 gap-4 sm:gap-5">
          {services.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              {/* Icon Box */}
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-xl ${item.bg}`}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={22}
                  height={22}
                  className="object-contain"
                />
              </div>

              {/* Title */}
              <h3 className="text-center text-sm sm:text-base font-semibold text-black leading-tight">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
