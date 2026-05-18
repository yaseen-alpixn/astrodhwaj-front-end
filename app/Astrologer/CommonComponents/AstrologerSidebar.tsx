"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Wallet,
  User,
  MessageSquare,
  Settings,
  Video,
  FileText,
  DollarSign,
} from "lucide-react";

type SidebarItem = {
  href: string;

  label: string;
  src: string;
};

const sidebarItems: SidebarItem[] = [
  {
    href: "/Astrologer/AstrologerHome",

    label: "Home",
    src: "/images/Home (2).png",
  },

  {
    href: "/Astrologer/Profile",

    label: "Profile",
    src: "/images/Profile (2).png",
  },
  {
    href: "/Astrologer/Wallet",

    label: "My Wallet",
    src: "/images/Wallet2.png",
  },
  {
    href: "/Astrologer/Messages",

    label: "Messages",
    src: "/images/Messages.png",
  },
  {
    href: "/Astrologer/Consultation",

    label: "Consultation",
    src: "/images/List.png",
  },
  {
    href: "/Astrologer/LiveSessions",

    label: "Live Stream",
    src: "/images/Live.png",
  },
  {
    href: "/Astrologer/Settings",

    label: "Settings",
    src: "/images/Settings2.png",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:fixed md:left-0 md:top-0 md:flex md:h-screen md:w-[230px] md:flex-col md:justify-between md:border-r md:bg-[#f6f4f8] md:px-4 md:py-4">
      {/* Top Section */}
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <Image
            src="/logo/astro-logo.svg"
            alt="AstroConnect logo"
            width={44}
            height={44}
            className="rounded-full object-cover"
          />
          <span className="text-lg font-semibold text-gray-800">
            AstroConnect
          </span>
        </div>

        {/* Menu */}
        <nav className="flex flex-col gap-2">
          {sidebarItems.map(({ href, label, src }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${
                    isActive
                      ? "bg-purple-200 text-purple-700"
                      : "text-gray-600 hover:bg-purple-100 hover:text-purple-700"
                  }`}
              >
                <Image
                  src={src}
                  width={20}
                  height={20}
                  alt={label + " navigation icon"}
                  className={` object-cover ${
                    isActive ? " text-purple-700" : "text-gray-600 "
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <Link
        href="/"
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-200 py-2 text-[13px] font-medium text-red-700 hover:bg-red-200 mb-2"
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
