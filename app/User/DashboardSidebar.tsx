"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Building2,
  Hand,
  Hash,
  Headphones,
  Home,
  MessageSquareText,
  Settings,
  Sparkles,
  WalletCards,
  Users,
} from "lucide-react";

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
    href: "/user/home",

    label: "Home",
    src: "/images/Home (2).png",
  },
  {
    href: "/User/Astrologers",
    src: "/images/SidebarUser.png",
    label: "Astrologers",
  },
  { href: "/user/wallet", src: "/images/Wallet2.png", label: "My Wallet" },
  { href: "/user/message", src: "/images/Messages.png", label: "Messages" },

  { href: "/user/kundali", src: "/images/SidebarStar.png", label: "Kundali" },
  {
    href: "/User/Numerology",
    src: "/images/SidebarHash.png",
    label: "Numerology",
  },
  {
    href: "/User/TarotReading",
    src: "/images/list.png",
    label: "Tarot Reading",
  },
  {
    href: "/User/ReikiHealing",
    src: "/images/SidebarPalm.png",
    label: "Reiki Healing",
  },
  { href: "/User/Vastu", src: "/images/SidebarVastu.png", label: "Vastu" },
  { href: "/user/courses", src: "/images/SidebarBook.png", label: "courses" },
  { href: "/User/Settings", src: "/images/Settings2.png", label: "Settings" },
];
export default function DashboardSidebar({
  mobile = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const asideClassName = mobile
    ? "flex min-h-0 flex-1 w-full flex-col overflow-y-auto border-r border-[#f0eaf7] p-3.5 py-3.5 shadow-[20px_0_60px_rgba(63,39,102,0.05)] sm:px-4 sm:py-4"
    : "hidden min-h-svh w-full flex-col border-r border-[#f0eaf7] bg-white px-3.5 py-3.5 sm:px-4 sm:py-4 md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[220px] md:max-w-[220px] md:overflow-y-auto";

  return (
    <aside className={asideClassName}>
      <Link
        href="/user/home"
        className="flex items-center gap-2 px-1 py-1"
        onClick={onNavigate}
      >
        <Image
          src="/logo/astro-logo.svg"
          alt="AstroConnect logo"
          width={52}
          height={52}
          className="h-[52px] w-[52px] rounded-full"
          unoptimized
        />
        <span className="text-[20px] font-bold tracking-[-0.03em] text-[#181818]">
          AstroConnect
        </span>
      </Link>
      <nav className="mt-5 flex flex-1 flex-col gap-1">
        {sidebarItems.map(({ href, src: src, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-2.5 rounded-[14px] bg-[#ecd9fb] px-3 py-2.5 text-[14px] font-medium text-[#8c279b]"
                  : "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[14px] font-medium text-[#3f3c45] transition-colors hover:bg-[#f7f3fc] hover:text-[#8c279b]"
              }
            >
              {" "}
              <Image
                src={src}
                alt={label + " navigation icon"}
                width={18}
                height={18}
                className="object-contain "
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>{" "}
      <div className="mt-6 w-full max-w-[170px] bg-purple-200 rounded-xl p-3">
        <Image
          src="/images/AudioCallpicture.jpg"
          alt="Donate with Pooja"
          width={200}
          height={100}
          className="w-full h-[100px] object-cover object-[center_55%]rounded-md"
        />
        <Link href="/donate">
          <button className="mt-3 w-full rounded-md bg-purple-700 py-2 text-[13px] font-medium text-white hover:bg-purple-600 transition">
            Donate With Pooja
          </button>
        </Link>
      </div>
      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-200 py-2 text-[13px] font-medium text-red-700 hover:bg-red-200"
      >
        <button className="flex items-center gap-2">
          <Image
            src="/images/LogoutIcon.png"
            alt="LogoutIcon"
            width={12}
            height={12}
            className="h-[12px] w-[12px] "
          />
          Logout
        </button>
      </Link>
    </aside>
  );
}
