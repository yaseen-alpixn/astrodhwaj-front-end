"use client";

import Image from "next/image";
import { Eye, Star, Lock } from "lucide-react";
import OurServices from "./OurServices";

const zodiacSigns = [
  { name: "Aries", color: "bg-red-100", img: "/images/Aries.png" },
  { name: "Taurus", color: "bg-green-100", img: "/images/Taurus.png" },
  { name: "Cancer", color: "bg-yellow-100", img: "/images/Cancer.png" },
  { name: "Gemini", color: "bg-gray-100", img: "/images/Gemini.png" },
  { name: "Leo", color: "bg-orange-100", img: "/images/Leo.png" },
  { name: "Virgo", color: "bg-lime-200", img: "/images/Virgo.png" },
  { name: "Libra", color: "bg-pink-100", img: "/images/Libra.png" },
  { name: "Scorpio", color: "bg-gray-300", img: "/images/Scorpio.png" },
  {
    name: "Sagittarius",
    color: "bg-[#4898E1]/10",
    img: "/images/Sagattarius.png",
  },
  { name: "Capricorn", color: "bg-stone-300", img: "/images/Capricorn.png" },
  { name: "Aquarius", color: "bg-indigo-100", img: "/images/Aquarius.png" },
  { name: "Pisces", color: "bg-cyan-100", img: "/images/Pisces.png" },
];

export default function HoroscopeSection() {
  return (
    <section className="w-full mt-6 p-2">
      <div className="flex flex-col xl:flex-row gap-6 items-stretch">
        {/* Left Side */}
        <div className="flex flex-col lg:flex-row gap-6 w-full xl:w-[70%]">
          {/* Horoscope Grid */}
          <div className="w-full lg:w-1/2 rounded-2xl bg-white border border-gray-200 shadow-sm p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-black mb-5">
              <Image
                src="/images/twoHalfMoon.png"
                alt="Daily Horoscope"
                width={18}
                height={18}
              />
              Daily Horoscope
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {zodiacSigns.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center rounded-lg p-3 gap-2 ${item.color}`}
                >
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={38}
                    height={38}
                  />
                  <p className="text-sm font-medium text-black text-center">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Card */}
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden bg-gradient-to-b from-[#0085FF] to-[#DD9A29] shadow-sm">
            {/* Top Image */}
            <div className="relative h-[150px] sm:h-[180px]">
              <Image
                src="/images/HomepageBook.png"
                alt="Live Session"
                fill
                className="object-cover"
              />

              {/* Top badges */}
              <div className="absolute top-4 left-4 right-4 flex justify-start gap-2">
                <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs text-white font-medium">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live
                </span>

                <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-700 font-medium">
                  <Eye size={14} />
                  234
                </span>
              </div>

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-13 w-13 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <Image
                    src="/images/playIcon.png"
                    width={18}
                    height={18}
                    alt="Play live session"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 text-white space-y-3">
              <h3 className="text-lg font-semibold">
                Vedic Astrology: Reading Your Birth Chart
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center font-semibold">
                    RS
                  </div>

                  <div>
                    <p className="font-semibold">Dr. Rajesh Sharma</p>
                    <p className="text-sm opacity-90">Vedic Astrology</p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-sm font-medium">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  4.8
                </span>
              </div>

              <p className="text-sm leading-6 opacity-95">
                Learn to interpret planetary positions in your birth chart and
                understand their impact on your life.
              </p>

              <button className="w-full rounded-lg bg-white py-3 flex items-center justify-center gap-2 text-sm font-medium text-[#4898E1] hover:bg-gray-100 transition">
                <Lock size={16} />
                Join Now – ₹299
              </button>
            </div>
          </div>
        </div>

        {/* Right Side Services */}
        <div className="w-full xl:w-[30%]">
          <OurServices />
        </div>
      </div>
    </section>
  );
}
