import Image from "next/image";
import Link from "next/link";
import {
  CirclePlay,
  Clock3,
  Eye,
  Heart,
  Radio,
  Share2,
  Star,
} from "lucide-react";

const liveSessions = [
  {
    title: "Vedic Astrology: Reading Your Birth Chart",
    expert: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    description:
      "Learn To Interpret Planetary Positions In Your Birth Chart And Understand Their Impact On Your Life.",
    price: "Join ₹299",
    rating: "4.8",
    image: "/images/HomepageBook.png",
  },
  {
    title: "Vedic Astrology: Reading Your Birth Chart",
    expert: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    description:
      "Learn To Interpret Planetary Positions In Your Birth Chart And Understand Their Impact On Your Life.",
    price: "Join ₹299",
    rating: "4.8",
    image: "/images/HomepageBook.png",
  },
  {
    title: "Vedic Astrology: Reading Your Birth Chart",
    expert: "Dr. Rajesh Sharma",
    specialty: "Vedic Astrology",
    description:
      "Learn To Interpret Planetary Positions In Your Birth Chart And Understand Their Impact On Your Life.",
    price: "Join ₹299",
    rating: "4.8",
    image: "/images/HomepageBook.png",
  },
];

export default function UserLiveSessions() {
  return (
    <section className="mt-6 w-full">
      <div className=" mx-auto sm:px-4 ">
        {/* Heading */}
        <div className="flex gap-1 items-center">
          <Image
            src="/images/serverLogo.png"
            alt="Live sessions"
            width={18}
            height={18}
            className="object-contain"
          />
          <p className="text-[18px] font-semibold tracking-[-0.05em] text-[#111111]">
            All Live sessions
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:h-[380px]">
          {liveSessions.map((session, index) => (
            <article
              key={`${session.expert}-${index}`}
              className="w-full overflow-hidden rounded-[18px] border border-[#dddddd] bg-white shadow-[0_10px_24px_rgba(0,0,0,0.06)] flex flex-col"
            >
              {/* IMAGE */}
              <div className="relative h-[150px] sm:h-[180px] md:h-[180px]">
                <Image
                  src={session.image}
                  alt={session.title}
                  fill
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.48)_100%)]" />

                {/* TOP BADGES */}
                <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#da0000] px-2 py-1 text-[11px] font-medium text-white">
                      <Radio size={12} />
                      Live
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-[#555555] backdrop-blur-sm">
                      <Clock3 size={12} />
                      45 min
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[11px] font-medium text-[#555555] backdrop-blur-sm">
                    <Eye size={12} />
                    234
                  </span>
                </div>

                {/* TITLE */}
                <div className="absolute inset-x-3 bottom-3">
                  <h3 className="text-[16px] font-semibold leading-snug text-white">
                    {session.title}
                  </h3>
                </div>
              </div>

              <div className="px-3 py-4 md:px-4 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#CCF7FF_0%,#E1E6FF_100%)] text-[14px] font-medium text-[#222222]">
                      RS
                    </div>

                    <div>
                      <p className="text-[15px] font-semibold text-[#111111] whitespace-nowrap">
                        {session.expert}
                      </p>
                      <p className="text-[14px] text-[#505050] font-medium">
                        {session.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 pt-1 text-[#111111]">
                    <Star size={15} className="fill-[#f4c400] text-[#f4c400]" />
                    <span className="text-[12px] font-medium">
                      {session.rating}
                    </span>
                  </div>
                </div>

                {/* DESCRIPTION */}
                <p className="mt-2 text-[13px] font-normal leading-[22px] text-[#232323] tracking-tight">
                  {session.description}
                </p>

                {/* BUTTON */}
                <div className="mt-auto flex items-center gap-[5px]">
                  <Link href="/User/JoinNow" className="flex-1">
                    <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#4898E1] px-4 py-3 h-[35px] text-[13px] font-medium text-white transition-colors hover:bg-[#3a78b2]">
                      {session.price}
                      <CirclePlay size={18} />
                    </button>
                  </Link>

                  <button
                    type="button"
                    aria-label="Add to wishlist"
                    className="mt-4 inline-flex h-[35px] w-[35px] items-center justify-center rounded-xl border border-[#d9d9d9] bg-white text-[#555555]"
                  >
                    <Heart size={22} />
                  </button>

                  <button
                    type="button"
                    aria-label="Share live session"
                    className="mt-4 inline-flex h-[35px] w-[35px] items-center justify-center rounded-xl border border-[#d9d9d9] bg-white text-[#555555]"
                  >
                    <Share2 size={22} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
