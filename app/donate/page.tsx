import Link from "next/link";

export default function DonatePage() {
  return (
    <section className="flex min-h-[calc(100vh-74px)] items-center justify-center bg-[linear-gradient(135deg,#f8efff_0%,#fff8d6_100%)] px-5 py-16 sm:px-8 lg:px-10">
      <div className="w-full max-w-2xl rounded-[28px] bg-white p-8 text-center shadow-[0_18px_48px_rgba(52,24,92,0.12)] sm:p-10">
        <h1 className="text-[2.2rem] font-semibold tracking-[-0.04em] text-[#171717] sm:text-[2.8rem]">
          Support AstroConnect
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[#57525f] sm:text-lg">
          The donation flow is not connected yet, but this route now works and can
          be extended without affecting the existing pages.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-2xl border border-[#d7c7ea] px-6 py-3 font-medium text-[#171717]"
          >
            Back Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-2xl bg-[linear-gradient(90deg,#d2a619_0%,#7a1eb1_100%)] px-6 py-3 font-medium text-white"
          >
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}
