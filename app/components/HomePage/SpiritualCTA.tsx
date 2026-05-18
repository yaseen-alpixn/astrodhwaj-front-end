import Link from "next/link";

function SpiritualCTA() {
  return (
    <section
      className="relative isolate flex min-h-[500px] items-center justify-center overflow-hidden px-5 py-16 text-white sm:px-8 sm:py-24 lg:px-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(30, 27, 60, 0.75) 100%), url('/images/spiritual-bg.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* Decorative overlay effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_50%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        {/* Main Heading */}
        <h2 className="text-balance text-[2.2rem] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.5rem]">
          Ready to Start Your Spiritual
          <br />
          Journey?
        </h2>

        {/* Subheading */}
        <p className="mt-6 max-w-3xl text-balance text-base leading-relaxed text-white/90 sm:mt-8 sm:text-[1.1rem]">
          Get instant access to{" "}
          <span className="font-semibold text-cyan-400">expert</span> astrologers
          and personalized guidance
        </p>

        {/* CTA Button */}
        <Link
          href="/talk-to-astrologer"
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#f4c400_0%,#c43a1e_50%,#7a1eb1_100%)] px-10 py-4 text-lg font-semibold text-white shadow-[0_16px_40px_rgba(122,30,177,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(122,30,177,0.45)] active:translate-y-0 sm:px-12 sm:py-5 sm:text-xl"
        >
          Get Started Now
        </Link>
      </div>
    </section>
  );
}

export default SpiritualCTA;
