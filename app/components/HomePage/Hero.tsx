import Link from "next/link";

function Hero() {
  return (
    <section
      className="relative isolate flex min-h-[calc(100vh-74px)] items-center justify-center overflow-hidden bg-[#05060b] px-5 py-16 text-white sm:px-8 lg:px-10"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(2, 4, 10, 0.72) 0%, rgba(2, 4, 10, 0.58) 36%, rgba(2, 4, 10, 0.82) 100%), url('/images/hero-bg-image.svg')",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(253,194,17,0.18),transparent_22%),radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.2),transparent_4%),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.18))]" />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <h1 className="max-w-4xl text-balance text-[2.4rem] font-normal leading-[1.02] tracking-[-0.05em] sm:text-[3.55rem] lg:text-[4.1rem]">
          Connect with
          <br />
          Expert <span className="text-[#f4c400]">Astrologers</span> Anytime,
          <br />
          Anywhere
        </h1>

        <p className="mt-5 max-w-4xl text-balance text-base leading-relaxed text-white/88 sm:mt-6 sm:text-[1.45rem]">
          Get personalized guidance on love, career, health, and more from
          certified astrologers. Available 24/7 via call, chat, or video
          consultation.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:flex-row">
          <Link
            href="/talk-to-astrologer"
            className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#f4c400_0%,#7a1eb1_100%)] px-8 py-4 text-lg font-medium text-white shadow-[0_18px_45px_rgba(122,30,177,0.28)] transition-transform hover:-translate-y-0.5"
          >
            Talk To Astrologer
          </Link>
          <Link
            href="/join-as-astrologer"
            className="inline-flex min-w-[220px] items-center justify-center rounded-2xl border border-white/70 bg-white/6 px-8 py-4 text-lg font-medium text-white backdrop-blur-[2px] transition-colors hover:bg-white/12"
          >
            Join As Astrologer
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
