"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Headphones,
  Home,
  Settings,
  WalletCards,
  Users,
  BadgeDollarSign,
  Newspaper,
  Radio,
  BarChart3,
  Shield,
} from "lucide-react";

type SidebarItem = {
  href: string;
  icon: LucideIcon;
  label: string;
};

type DashboardSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const sidebarItems: SidebarItem[] = [
  { href: "/Admin/DashBoardOverview", icon: Home, label: "Dashboard" },
  { href: "/Admin/UserManagement", icon: Users, label: "Users" },
  {
    href: "/Admin/AstrologerManagement",
    icon: Users,
    label: "Astrologers",
  },
  {
    href: "/Admin/PricingAndCommition",
    icon: BadgeDollarSign,
    label: "Pricing",
  },
  {
    href: "/Admin/WalletTransaction",
    icon: WalletCards,
    label: "Transaction",
  },
  { href: "/Admin/ContentManagement", icon: Newspaper, label: "Content" },
  { href: "/Admin/LiveSession", icon: Radio, label: "Live Sessions" },
  { href: "/Admin/ReportAnalytics", icon: BarChart3, label: "Analytics" },
  {
    href: "/Admin/SupportAndTicketSystem",
    icon: Headphones,
    label: "Support Tickets",
  },
  {
    href: "/Admin/RoleAndPermission",
    icon: Shield,
    label: "Roles & Permissions",
  },
  { href: "/Admin/AdminSettings", icon: Settings, label: "Settings" },
];
export default function DashboardSidebar({
  mobile = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const asideClassName = mobile
    ? "flex min-h-0 flex-1 w-full flex-col overflow-y-auto border-r border-[#f0eaf7] p-1 py-3.5 shadow-[10px_0_60px_rgba(63,39,102,0.05)] sm:px-2 sm:py-4"
    : "hidden min-h-svh w-full flex-col border-r border-[#f0eaf7] bg-white px-1 py-3 sm:px-1 sm:py-4 md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-[200px] md:max-w-[210px] md:overflow-y-auto";

  return (
    <aside className={asideClassName}>
      <Link
        href="/Admin/DashBoardOverview"
        className="flex items-center gap-2 px-1 py-1"
        onClick={onNavigate}
      >
        <Image
          src="/logo/astro-logo.svg"
          alt="AstroConnect logo"
          width={48}
          height={48}
          className="h-[48px] w-[48px] rounded-full"
          unoptimized
        />
        <span className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[#181818]">
          AstroConnect
        </span>
      </Link>
      <nav className="mt-5 flex flex-1 flex-col gap-1">
        {sidebarItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-2.5 rounded-[14px] bg-[#ecd9fb] px-3 py-2.5 text-[0.89rem] font-medium text-[#8c279b]"
                  : "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[1rem] font-medium text-[#3f3c45] transition-colors hover:bg-[#f7f3fc] hover:text-[#8c279b]"
              }
            >
              {" "}
              <Icon className="h-4 w-4 shrink-0" strokeWidth={2.2} />
              <span className="whitespace-nowrap text-[15px]">{label}</span>
            </Link>
          );
        })}
      </nav>{" "}
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
