import Image from "next/image";
import Link from "next/link";

type AuthRole = "user" | "astrologer";

type EmailAccessCardProps = {
  role: AuthRole;
};

function EmailAccessCard({ role }: EmailAccessCardProps) {
  const userButtonClass =
    role === "user"
      ? "border-[#7a1eb1]/35 bg-[#f7f0ff] text-[#6d1ad0]"
      : "border-black/16 bg-white text-[#1a1a1a]";
  const astrologerButtonClass =
    role === "astrologer"
      ? "border-[#7a1eb1]/35 bg-[#f7f0ff] text-[#6d1ad0]"
      : "border-black/16 bg-white text-[#1a1a1a]";

  return (
    <section
      className="relative isolate flex h-svh items-center justify-center overflow-hidden px-4 py-4 sm:px-8 lg:px-10"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(3, 9, 38, 0.86) 0%, rgba(27, 18, 66, 0.84) 55%, rgba(78, 22, 102, 0.72) 100%), url('/images/login-bg.svg')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(84,103,255,0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(215,56,255,0.2),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-[560px] rounded-[26px] bg-[linear-gradient(180deg,rgba(72,78,118,0.9)_0%,rgba(46,52,90,0.9)_100%)] p-2 shadow-[0_30px_120px_rgba(7,12,40,0.45)] ring-1 ring-white/12 sm:p-3">
        <div className="rounded-[18px] bg-[#fcfbfa] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-5 sm:py-5">
          <div className="mx-auto flex max-w-[410px] flex-col">
            <div className="flex justify-center">
              <div className="rounded-full bg-[linear-gradient(135deg,#f5c84b_0%,#7f2cff_100%)] p-[3px] shadow-[0_10px_24px_rgba(122,30,177,0.24)]">
                <Image
                  src="/logo/astro-logo.svg"
                  alt="AstroConnect logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  unoptimized
                />
              </div>
            </div>

            <div className="mt-2.5 text-center">
              <h1 className="text-[1.5rem] font-extrabold tracking-[-0.04em] text-[#111111] sm:text-[1.8rem]">
                Welcome Back!
              </h1>
            </div>

            <div className="mt-4">
              <label
                htmlFor="full-name"
                className="block text-[0.9rem] font-medium text-[#161616]"
              >
                Full Name
              </label>
              <input
                id="full-name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                className="mt-1.5 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#7a1eb1] focus:ring-4 focus:ring-[#7a1eb1]/12"
              />
            </div>

            <div className="mt-3">
              <label
                htmlFor="email-address"
                className="block text-[0.9rem] font-medium text-[#161616]"
              >
                Email
              </label>
              <input
                id="email-address"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="mt-1.5 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#7a1eb1] focus:ring-4 focus:ring-[#7a1eb1]/12"
              />
            </div>

            <div className="mt-3">
              <label
                htmlFor="password"
                className="block text-[0.9rem] font-medium text-[#161616]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                className="mt-1.5 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#7a1eb1] focus:ring-4 focus:ring-[#7a1eb1]/12"
              />
            </div>

            <Link
              href="/user/home"
              className="mt-3 inline-flex h-10 items-center justify-center rounded-lg bg-[linear-gradient(90deg,#7d17c0_0%,#7013b7_100%)] px-6 text-[0.9rem] font-semibold text-white shadow-[0_14px_40px_rgba(122,30,177,0.28)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Create Account
            </Link>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <Link
                href="/signup/user"
                className={`inline-flex h-10 items-center justify-center rounded-lg border px-3 text-center text-[0.9rem] font-medium transition-colors hover:border-[#7a1eb1] hover:text-[#7a1eb1] ${userButtonClass}`}
              >
                Login as User
              </Link>
              <Link
                href="/Astrologer"
                className={`inline-flex h-10 items-center justify-center rounded-lg border px-3 text-center text-[0.9rem] font-medium transition-colors hover:border-[#7a1eb1] hover:text-[#7a1eb1] ${astrologerButtonClass}`}
              >
                Login as Astrologer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EmailAccessCard;
