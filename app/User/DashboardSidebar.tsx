"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "../../services/api";

type SidebarItem = {
  href: string;

  label: string;
  src: string;
};

type DashboardSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/User/home",

    label: "Home",
    src: "/images/Home (2).png",
  },
  {
    href: "/User/Astrologers",
    src: "/images/SidebarUser.png",
    label: "Astrologers",
  },
  { href: "/User/wallet", src: "/images/Wallet2.png", label: "My Wallet" },
  { href: "/User/message", src: "/images/Messages.png", label: "Messages" },
  { href: "/User/LiveSessions", src: "/images/ServerLogo.png", label: "Live Sessions" },
  { href: "/User/SupportTickets", src: "/images/SidebarSupport.png", label: "Support" },

  { href: "/User/kundali", src: "/images/SidebarStar.png", label: "Kundali" },
  {
    href: "/User/Numerology",
    src: "/images/SidebarHash.png",
    label: "Numerology",
  },
  {
    href: "/User/TarotReading",
    src: "/images/List.png",
    label: "Tarot Reading",
  },
  {
    href: "/User/ReikiHealing",
    src: "/images/SidebarPalm.png",
    label: "Reiki Healing",
  },
  { href: "/User/Vastu", src: "/images/SidebarVastu.png", label: "Vastu" },
  { href: "/User/courses", src: "/images/SidebarBook.png", label: "courses" },
  { href: "/User/Settings", src: "/images/Settings2.png", label: "Settings" },
];
export default function DashboardSidebar({
  mobile = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const asideClassName = mobile
    ? "flex min-h-0 flex-1 w-full flex-col overflow-y-auto border-r border-[#e5e7eb] p-3.5 py-3.5 shadow-[20px_0_60px_rgba(72,152,225,0.05)] sm:px-4 sm:py-4"
    : "hidden min-h-svh w-full flex-col border-r border-[#e5e7eb] bg-white px-3.5 py-3.5 sm:px-4 sm:py-4 md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[220px] md:max-w-[220px] md:overflow-y-auto";

  return (
    <aside className={asideClassName}>
      <Link
        href="/User/home"
        className="flex items-center gap-2 px-1 py-1"
        onClick={onNavigate}
      >
        <Image
          src="/logo/astro-logo.svg"
          alt="AstroDhwaj logo"
          width={52}
          height={52}
          className="h-[52px] w-[52px] rounded-full"
          unoptimized
        />
        <span className="text-[20px] font-bold tracking-[-0.03em] text-[#181818]">
          Astro Dhwaj
        </span>
      </Link>
      <nav className="mt-5 flex flex-1 flex-col gap-1">
        {sidebarItems.map(({ href, src: src, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-2.5 rounded-[14px] bg-[#E8F4FF] px-3 py-2.5 text-[14px] font-medium text-[#4898E1]"
                  : "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[14px] font-medium text-[#3f3c45] transition-colors hover:bg-[#E8F4FF] hover:text-[#4898E1]"
              }
            >
              {" "}
              <Image
                src={src}
                alt={label + " navigation icon"}
                width={18}
                height={18}
                style={{ width: "auto", height: "auto" }}
                className="object-contain "
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>{" "}
      <div className="mt-6 w-full max-w-[170px] bg-[#4898E1]/10 rounded-xl p-3">
        <Image
          src="/images/AudioCallpicture.jpg"
          alt="Donate with Pooja"
          width={200}
          height={100}
          style={{ width: "auto", height: "auto" }}
          className="w-full h-[100px] object-cover object-[center_55%]rounded-md"
        />
        <Link href="/donate">
          <button className="mt-3 w-full rounded-md bg-[#4898E1] py-2 text-[13px] font-medium text-white hover:bg-[#4898E1]/90 transition">
            Donate With Pooja
          </button>
        </Link>
      </div>
      <button
        onClick={() => {
          clearSession("user");
          router.push("/login/user");
        }}
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-200 py-2 text-[13px] font-medium text-red-700 hover:bg-red-200 w-full"
      >
        <Image
          src="/images/LogoutIcon.png"
          alt="LogoutIcon"
          width={12}
          height={12}
          style={{ width: "auto", height: "auto" }}
          className="h-[12px] w-[12px] "
        />
        Logout
      </button>
    </aside>
  );
}
