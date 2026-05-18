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
            Astro Dhwaj
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
                      ? "bg-[#E8F4FF] text-[#4898E1]"
                      : "text-gray-600 hover:bg-[#E8F4FF] hover:text-[#4898E1]"
                  }`}
              >
                <Image
                  src={src}
                  width={20}
                  height={20}
                  alt={label + " navigation icon"}
                  className={` object-cover ${
                    isActive ? " text-[#4898E1]" : "text-gray-600 "
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <button className="flex mt-2 items-center justify-center gap-2 bg-red-200 text-red-600 py-2.5 rounded-xl text-sm font-medium hover:bg-red-300 transition">
        <Image
          src="/images/LogoutIcon.png"
          alt="logout"
          width={14}
          height={14}
        />
        Logout
      </button>
    </aside>
  );
}
