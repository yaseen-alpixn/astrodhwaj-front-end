import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-[#E5E5E5] bg-[#F8F6FB] px-4 pt-14 pb-8 sm:px-8">
      <div className="relative mx-auto max-w-[1600px] flex flex-col items-center">
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-center text-[16px] sm:text-[20px] md:text-[24px] font-medium text-[#4898E1]">
            <h3>
              <Link href="/service">Service</Link>
            </h3>
            <h3>
              <Link href="/how-it-works">How It Works</Link>
            </h3>
            <h3>
              <Link href="/about">About</Link>
            </h3>
            <h3>
              <Link href="/testimonials">Testimonials</Link>
            </h3>
            <h3>
              <Link href="/for-astrologers">For Astrologers</Link>
            </h3>
          </div>

          <p className="mt-6 max-w-[980px] px-4 text-center text-[14px] sm:text-[18px] md:text-[22px] leading-relaxed text-[#2E2E2E]">
            India&apos;s leading platform connecting users with expert
            astrologers for personalized spiritual guidance.
          </p>
        </div>

        {/* Big Background Name - half visible at all breakpoints */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-10 overflow-hidden">
          <h1
            className="
              font-semibold leading-none
              bg-gradient-to-r
              from-[#0085FF]
             
              to-[#DD9A29]
              bg-clip-text text-transparent opacity-50
              whitespace-nowrap
            "
            style={{
              fontSize: "clamp(50px, 15vw, 300px)",
              transform: "translateY(30%)",
            }}
          >
            Astro Dhwaj
          </h1>
        </div>

        <div className="h-[60px] sm:h-[80px] md:h-[100px] lg:h-[120px]" />
      </div>
    </footer>
  );
}
