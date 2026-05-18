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
    color: "bg-purple-100",
    img: "/images/Sagattarius.png",
  },
  { name: "Capricorn", color: "bg-stone-300", img: "/images/Capricorn.png" },
  { name: "Aquarius", color: "bg-indigo-100", img: "/images/Aquarius.png" },
  { name: "Pisces", color: "bg-cyan-100", img: "/images/Pisces.png" },
];

export default function HoroscopeSection() {
  return (
    <section className="w-full px-2 py-4 sm:px-4">
      <div className="flex flex-col xl:flex-row items-start gap-6">
        {/* Left Side */}
        <div className="grid w-full xl:w-[70%] grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Horoscope Grid */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold">
              <Image
                src="/images/StarLogo.png"
                alt="Daily Horoscope"
                width={18}
                height={18}
              />
              Daily Horoscope
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 sm:gap-5">
              {zodiacSigns.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center rounded-xl p-3 ${item.color}`}
                >
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={38}
                    height={45}
                    className="h-auto"
                  />
                  <p className="mt-2 text-xs sm:text-sm font-medium text-center">
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Live Card */}
          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#A20DAD] to-[#D20B5E] shadow-sm">
            <div className="relative aspect-[16/9]">
              <Image
                src="/images/HomepageBook.png"
                alt="Live Session"
                fill
                className="object-cover"
              />

              <div className="absolute left-4 right-4 top-4 flex justify-between">
                <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs text-white">
                  <span className="h-2 w-2 rounded-full bg-white" />
                  Live
                </span>

                <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs text-gray-700">
                  <Eye size={14} />
                  234
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg">
                  <Image
                    src="/images/playIcon.png"
                    width={18}
                    height={18}
                    alt="Play"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5 text-white">
              <h3 className="text-lg font-semibold">
                Vedic Astrology: Reading Your Birth Chart
              </h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-semibold">
                    RS
                  </div>

                  <div>
                    <p className="font-semibold">Dr. Rajesh Sharma</p>
                    <p className="text-sm opacity-90">Vedic Astrology</p>
                  </div>
                </div>

                <span className="flex items-center gap-1 text-sm">
                  <Star className="fill-yellow-400 text-yellow-400" size={18} />
                  4.8
                </span>
              </div>

              <p className="text-sm leading-6 opacity-95">
                Learn to interpret planetary positions in your birth chart.
              </p>

              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-3 text-sm font-medium text-purple-700 transition hover:bg-gray-100">
                <Lock size={16} />
                Join Now – ₹299
              </button>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full xl:w-[30%]">
          <OurServices />
        </div>
      </div>
    </section>
  );
}
