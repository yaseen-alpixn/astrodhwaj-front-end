import Image from "next/image";
import { Star } from "lucide-react";

const astrologers = [
  {
    id: 1,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Online",
    statusClassName: "text-[#1eb24a]",
  },
  {
    id: 2,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Busy",
    statusClassName: "text-[#e2ae00]",
  },
  {
    id: 3,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Offline",
    statusClassName: "text-[#7c7c84]",
  },
  {
    id: 4,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Online",
    statusClassName: "text-[#1eb24a]",
  },
  {
    id: 5,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Busy",
    statusClassName: "text-[#e2ae00]",
  },
  {
    id: 6,
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rating: "4.8",
    price: "Rs25/Min",
    status: "Offline",
    statusClassName: "text-[#7c7c84]",
  },
];

export default function FeaturedAstrologer() {
  return (
    <section className="mt-12 pb-6 w-full">
      <div className="mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-1 text-[#171717]">
          <Star className="h-5 w-5 text-[#4898E1]" strokeWidth={2} />
          <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
            Featured Astrologers
          </h2>
        </div>

        {/* GRID */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-6">
          {astrologers.map((astrologer) => (
            <article
              key={astrologer.id}
              className="rounded-[22px] border border-[#ece8f1] bg-white p-4 shadow-[0_12px_40px_rgba(86,63,118,0.05)] flex flex-col"
            >
              {/* PROFILE */}
              <div className="flex items-center gap-4">
                <Image
                  src="/images/AudioCallpicture.jpg"
                  alt={astrologer.name}
                  width={72}
                  height={72}
                  className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] rounded-full object-cover"
                  unoptimized
                />
              </div>

              {/* CONTENT */}
              <div className="mt-4 sm:mt-5 flex flex-col flex-grow ">
                <h3 className="text-[16px] font-semibold text-[#141414]">
                  {astrologer.name}
                </h3>

                <p className="mt-2 text-[13px] font-normal leading-[22px] text-[#2d2d2d] tracking-tight">
                  {astrologer.specialties}
                </p>

                <div className="my-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6d6d75]">
                    <Star className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px] fill-[#f4c400] text-[#f4c400]" />
                    {astrologer.rating}
                  </span>

                  <span className="text-[11px] text-[#7b7b83]">|</span>

                  <span className="text-[13px] font-medium text-[#4898E1]">
                    {astrologer.price}
                  </span>

                  <span className="text-[11px] text-[#7b7b83]">|</span>

                  <span
                    className={`text-[11px] font-medium ${astrologer.statusClassName}`}
                  >
                    {astrologer.status}
                  </span>
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  className="mt-1 inline-flex h-8 sm:h-10 w-full items-center justify-center rounded-[12px] border border-[#4898E1] bg-white px-4 text-[13px] font-medium text-[#171717] transition-colors hover:bg-[#faf7ff]"
                >
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
