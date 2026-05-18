// app/page.js
import Link from "next/link";
import { Sparkles, Stars, Calculator, Hand, Gem } from "lucide-react";
import Image from "next/image";
const services = [
  {
    title: "Tarot Reading",
    icon: Sparkles,
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

export default function ServicesStrip() {
  return (
    <section className="w-full py-4 bg-white px-4 mt-5">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
          {services.map((item, index) => {
            const Icon = item.icon;

            const href =
              item.title === "Tarot Reading" ? "/User/TarotReading" :
              item.title === "Astrology" ? "/User/kundali" :
              item.title === "Numerology" ? "/User/Numerology" :
              item.title === "Palmistry" ? "/User/kundali" :
              item.title === "Reiki Healing" ? "/User/kundali" :
              item.title === "Vastu" ? "/User/kundali" : "#";

            return (
              <Link key={index} href={href}>
                <div
                  className="h-[103px] w-full max-w-[120px] rounded-[15px] border border-black/10 p-[15px] flex flex-col items-center justify-center gap-[10px] mx-auto lg:w-[120px]"
                >
                  {/* Icon Box */}
                  <div
                    className={`w-[47px] h-[45px] rounded-[10px] pt-[3px] pr-[15px] pb-[5px] pl-[15px] flex items-center justify-center ${item.bg}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.title + " service icon"}
                      width={18}
                      height={18}
                      className="object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-['DM_Sans'] font-semibold whitespace-nowrap text-[16px] leading-[100%] tracking-[0%] text-center capitalize text-black">
                    {item.title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
