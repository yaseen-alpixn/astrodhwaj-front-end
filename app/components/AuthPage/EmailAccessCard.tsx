"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { adminLogin, login, signupUser } from "@/services/auth.service";
import { clearSession, hasPermission } from "@/services/api";

type AuthRole = "user" | "astrologer" | "admin";
type AuthMode = "login" | "signup";

type EmailAccessCardProps = {
  role: AuthRole;
  mode?: AuthMode;
};

function EmailAccessCard({ role, mode = "login" }: EmailAccessCardProps) {
  const router = useRouter();
  
  // State variables for dynamic forms
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic titles based on role and mode
  const getCardTitle = () => {
    if (mode === "signup") {
      return role === "astrologer" ? "Astrologer Registration" : "Create Seeker Account";
    }
    if (role === "admin") return "Admin Login";
    return role === "astrologer" ? "Astrologer Login" : "Seeker Login";
  };

  const getCardSubtitle = () => {
    if (mode === "signup") {
      return "Start your spiritual journey with AstroDhwaj";
    }
    return role === "admin" ? "Welcome back! Access your admin dashboard" : "Welcome back! Access your professional dashboard";
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "signup") {
        if (role === "user") {
          // 1. Signup the user
          await signupUser({
            full_name: fullName,
            email: email,
            password: password,
            phone: phone || undefined,
          });

          setSuccess("Account created successfully! Logging you in...");

          // 2. Auto-login immediately after signup
          const loginResponse = await login(email, password);
          
          // Verify account type matches standard user flow
          if (loginResponse.user.account_type === "user") {
            router.push("/User/home");
          } else {
            router.push("/User/home");
          }
        }
      } else {
        // Mode is login
        const loginResponse = role === "admin" ? await adminLogin(email, password) : await login(email, password);
        const actualAccountType = loginResponse.user.account_type;

        // Role Mismatch Guard checks
        if (role === "user" && actualAccountType === "astrologer") {
          clearSession("user");
          clearSession("admin");
          throw new Error("This account is registered as an astrologer. Please use the astrologer login page.");
        }
        if (role === "astrologer" && actualAccountType === "user") {
          clearSession("astrologer");
          clearSession("admin");
          throw new Error("This account is registered as a seeker. Please use the seeker login page.");
        }
        if (role === "admin" && actualAccountType !== "admin" && actualAccountType !== "staff") {
          clearSession("admin");
          throw new Error("This account is not authorized for the admin panel.");
        }

        // Check preserved route redirect
        const redirectTo = sessionStorage.getItem("redirect_to");
        sessionStorage.removeItem("redirect_to");

        if (redirectTo) {
          setSuccess("Authentication successful! Redirecting...");
          router.push(redirectTo);
        } else if (actualAccountType === "admin" || actualAccountType === "staff") {
          setSuccess("Welcome Administrator! Redirecting...");
          let targetRoute = "/Admin/DashBoardOverview";
          if (!hasPermission("dashboard:read", "admin")) {
            const routesToCheck = [
              { perm: "users:read", path: "/Admin/UserManagement" },
              { perm: "astrologers:read", path: "/Admin/AstrologerManagement" },
              { perm: "pricing:read", path: "/Admin/PricingAndCommition" },
              { perm: "transactions:read", path: "/Admin/WalletTransaction" },
              { perm: "payouts:read", path: "/Admin/Payouts" },
              { perm: "content:read", path: "/Admin/ContentManagement" },
              { perm: "live_sessions:read", path: "/Admin/LiveSession" },
              { perm: "analytics:read", path: "/Admin/ReportAnalytics" },
              { perm: "support:read", path: "/Admin/SupportAndTicketSystem" },
              { perm: "roles:read", path: "/Admin/RoleAndPermission" },
              { perm: "settings:read", path: "/Admin/AdminSettings" },
              { perm: "audit_logs:read", path: "/Admin/AuditLogs" },
              { perm: "notifications:read", path: "/Admin/Notifications" }
            ];
            const allowed = routesToCheck.find(r => hasPermission(r.perm, "admin"));
            targetRoute = allowed ? allowed.path : "/unauthorized";
          }
          router.push(targetRoute);
        } else if (actualAccountType === "astrologer") {
          setSuccess("Welcome Astrologer! Redirecting...");
          router.push("/Astrologer/AstrologerHome");
        } else {
          setSuccess("Welcome Seeker! Redirecting...");
          router.push("/User/home");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="relative z-10 w-full max-w-[500px] rounded-[26px] bg-[linear-gradient(180deg,rgba(72,78,118,0.9)_0%,rgba(46,52,90,0.9)_100%)] p-2 shadow-[0_30px_120px_rgba(7,12,40,0.45)] ring-1 ring-white/12 sm:p-3">
        <div className="rounded-[18px] bg-[#fcfbfa] px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-6 sm:py-7">
          <form onSubmit={handleSubmit} className="mx-auto flex max-w-[410px] flex-col">
            
            {/* Logo */}
            <div className="flex justify-center">
              <div className="rounded-full bg-[linear-gradient(135deg,#f5c84b_0%,#7f2cff_100%)] p-[3px] shadow-[0_10px_24px_rgba(122,30,177,0.24)]">
                <Image
                  src="/logo/logo.jpeg"
                  alt="AstroDhwaj logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full"
                  unoptimized
                />
              </div>
            </div>

            {/* Header Titles */}
            <div className="mt-2.5 text-center">
              <h1 className="text-[1.5rem] font-extrabold tracking-[-0.04em] text-[#111111] sm:text-[1.8rem]">
                {getCardTitle()}
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {getCardSubtitle()}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-600 shadow-sm leading-relaxed">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-3 text-xs font-semibold text-green-600 shadow-sm">
                {success}
              </div>
            )}

            {/* Input Form Fields */}
            {mode === "signup" && (
              <div className="mt-4">
                <label
                  htmlFor="full-name"
                  className="block text-[0.85rem] font-semibold text-[#161616]"
                >
                  Full Name
                </label>
                <input
                  id="full-name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#7a1eb1]/12"
                />
              </div>
            )}

            <div className="mt-3.5">
              <label
                htmlFor="email-address"
                className="block text-[0.85rem] font-semibold text-[#161616]"
              >
                Email Address
              </label>
              <input
                id="email-address"
                type="email"
                required
                autoComplete="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#7a1eb1]/12"
              />
            </div>

            <div className="mt-3.5">
              <label
                htmlFor="password"
                className="block text-[0.85rem] font-semibold text-[#161616]"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-10 w-full rounded-lg border border-black/18 bg-white pl-3.5 pr-10 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#7a1eb1]/12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-800 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.6}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.6}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="mt-3.5">
                <label
                  htmlFor="phone-number"
                  className="block text-[0.85rem] font-semibold text-[#161616]"
                >
                  Phone Number (Optional)
                </label>
                <input
                  id="phone-number"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-black/18 bg-white px-3.5 text-[0.9rem] text-[#161616] outline-none transition focus:border-[#0085FF] focus:ring-4 focus:ring-[#7a1eb1]/12"
                />
              </div>
            )}

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[linear-gradient(90deg,#0085FF_0%,#7013b7_100%)] px-6 text-[0.9rem] font-semibold text-white shadow-[0_14px_40px_rgba(122,30,177,0.28)] transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading
                ? mode === "signup"
                  ? "Creating Account..."
                  : "Signing In..."
                : mode === "signup"
                ? "Create Account"
                : "Sign In"}
            </button>

            {/* Navigation Mode / Role Switching Links */}
            <div className="mt-5 flex flex-col gap-2.5 text-center text-xs font-semibold text-gray-500">
              {mode === "login" ? (
                <>
                  {role === "user" ? (
                    <>
                      <div>
                        Don&apos;t have an account?{" "}
                        <Link href="/signup/user" className="text-[#0085FF] hover:underline">
                          Sign Up here
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-2.5 mt-1 text-[11px]">
                        Are you an Astrologer?{" "}
                        <Link href="/login/astrologer" className="text-[#7013b7] hover:underline">
                          Log In here
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-gray-100 pt-2.5 text-[11px]">
                        Are you a Seeker?{" "}
                        <Link href="/login/user" className="text-[#0085FF] hover:underline">
                          Log In here
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-2.5 mt-1.5 text-[12px]">
                        Want to work with us?{" "}
                        <Link href="/join-as-astrologer" className="text-amber-500 font-bold hover:underline">
                          Join with Astro Dhwaj
                        </Link>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <div>
                    Already have an account?{" "}
                    <Link href="/login/user" className="text-[#0085FF] hover:underline">
                      Log In here
                    </Link>
                  </div>
                </>
              )}
            </div>

          </form>
        </div>
      </div>
    </section>
  );
}

export default EmailAccessCard;
