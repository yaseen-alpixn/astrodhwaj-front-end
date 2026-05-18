import { Star } from "lucide-react";

const mentors = [
  {
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rate: "₹25/Min",
    status: "Online",
    statusClassName: "text-[#0ea63a]",
    initials: "PS",
    avatarClassName:
      "bg-[linear-gradient(135deg,#2f1b12_0%,#8d5b3c_42%,#e0b38d_100%)]",
  },
  {
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rate: "₹25/Min",
    status: "Busy",
    statusClassName: "text-[#d9a100]",
    initials: "PS",
    avatarClassName:
      "bg-[linear-gradient(135deg,#2f1b12_0%,#8d5b3c_42%,#e0b38d_100%)]",
  },
  {
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rate: "₹25/Min",
    status: "Offline",
    statusClassName: "text-[#707070]",
    initials: "PS",
    avatarClassName:
      "bg-[linear-gradient(135deg,#2f1b12_0%,#8d5b3c_42%,#e0b38d_100%)]",
  },
  {
    name: "Astrologer Priya Sharma",
    specialties: "Vedic Astrology, Tarot Reading, Numerology",
    rate: "₹25/Min",
    status: "Offline",
    statusClassName: "text-[#707070]",
    initials: "PS",
    avatarClassName:
      "bg-[linear-gradient(135deg,#2f1b12_0%,#8d5b3c_42%,#e0b38d_100%)]",
  },
];

function TopMentors() {
  return (
    <section className="w-full bg-white px-5 py-2 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto ">
        <h2 className="text-center text-[2.4rem] font-medium tracking-[-0.05em] text-[#111111] sm:text-[3.2rem]">
          Our Top Rated Mentors
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {mentors.map((mentor, index) => (
            <article
              key={`${mentor.name}-${index}`}
              className="rounded-[18px] border border-[#d8d8d8] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(0,0,0,0.04)]"
            >
              <div
                className={`flex h-[74px] w-[74px] items-center justify-center rounded-full text-[1.35rem] font-semibold text-white ${mentor.avatarClassName}`}
              >
                {mentor.initials}
              </div>

              <h3 className="mt-4 text-[1.15rem] font-medium tracking-[-0.03em] text-[#111111] sm:text-[1.2rem]">
                {mentor.name}
              </h3>

              <p className="mt-2 max-w-[260px] text-[0.95rem] leading-relaxed text-[#222222] sm:text-[1rem]">
                {mentor.specialties}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.95rem] text-[#4898E1]">
                <span className="inline-flex items-center gap-1">
                  <Star size={17} className="fill-[#f4c400] text-[#f4c400]" />
                  4.8
                </span>
                <span>&bull;</span>
                <span className="font-medium text-[#4898E1">{mentor.rate}</span>
                <span>&bull;</span>
                <span className={mentor.statusClassName}>{mentor.status}</span>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-[#4898E1] px-5 py-3 text-[1rem] font-medium text-[#111111] transition-colors hover:bg-[#faf5ff]"
              >
                View Profile
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TopMentors;
