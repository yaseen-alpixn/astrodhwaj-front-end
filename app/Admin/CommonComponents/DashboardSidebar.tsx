"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
import { clearAdminSession } from "../api";
import { getStoredPermissions } from "@/services/api";

type SidebarItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  permission: string;
};

type DashboardSidebarProps = {
  mobile?: boolean;
  onNavigate?: () => void;
};

const sidebarItems: SidebarItem[] = [
  { href: "/Admin/DashBoardOverview", icon: Home, label: "Dashboard", permission: "dashboard:read" },
  { href: "/Admin/UserManagement", icon: Users, label: "Users", permission: "users:read" },
  {
    href: "/Admin/AstrologerManagement",
    icon: Users,
    label: "Astrologers",
    permission: "astrologers:read",
  },
  {
    href: "/Admin/PricingAndCommition",
    icon: BadgeDollarSign,
    label: "Pricing",
    permission: "pricing:read",
  },
  {
    href: "/Admin/WalletTransaction",
    icon: WalletCards,
    label: "Transaction",
    permission: "transactions:read",
  },
  {
    href: "/Admin/Payouts",
    icon: WalletCards,
    label: "Payouts",
    permission: "payouts:read",
  },
  { href: "/Admin/ContentManagement", icon: Newspaper, label: "Content", permission: "content:read" },
  { href: "/Admin/LiveSession", icon: Radio, label: "Live Sessions", permission: "live_sessions:read" },
  { href: "/Admin/ReportAnalytics", icon: BarChart3, label: "Analytics", permission: "analytics:read" },
  {
    href: "/Admin/SupportAndTicketSystem",
    icon: Headphones,
    label: "Support Tickets",
    permission: "support:read",
  },
  {
    href: "/Admin/RoleAndPermission",
    icon: Shield,
    label: "Roles & Permissions",
    permission: "roles:read",
  },
  { href: "/Admin/AdminSettings", icon: Settings, label: "Settings", permission: "settings:read" },
];
export default function DashboardSidebar({
  mobile = false,
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [permissions] = useState<string[]>(() => getStoredPermissions("admin"));
  const visibleItems = sidebarItems.filter((item) => permissions.includes("*") || permissions.includes(item.permission));
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
          alt="AstroDhwaj logo"
          width={48}
          height={48}
          className="h-[48px] w-[48px] rounded-full"
          unoptimized
        />
        <span className="text-[1.2rem] font-semibold tracking-[-0.03em] text-[#181818]">
          Astro Dhwaj
        </span>
      </Link>
      <nav className="mt-5 flex flex-1 flex-col gap-1">
        {visibleItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={label}
              href={href}
              onClick={onNavigate}
              className={
                isActive
                  ? "flex items-center gap-2.5 rounded-[14px] bg-[#E8F4FF] px-3 py-2.5 text-[0.89rem] font-medium text-[#4898E1]"
                  : "flex items-center gap-2.5 rounded-[14px] px-3 py-2.5 text-[1rem] font-medium text-[#3f3c45] transition-colors hover:bg-[#E8F4FF] hover:text-[#4898E1]"
              }
            >
              {" "}
              <Icon
                className="h-4 w-4 shrink-0 text-inherit"
                strokeWidth={2.2}
              />
              <span className="whitespace-nowrap text-[15px]">{label}</span>
            </Link>
          );
        })}
      </nav>{" "}
      <button
        className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-red-200 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
        onClick={() => {
          clearAdminSession();
          router.push("/login/admin");
        }}
      >
        <Image
          src="/images/LogoutIcon.png"
          alt="LogoutIcon"
          width={12}
          height={12}
          className="h-[12px] w-[12px] "
        />
        Logout
      </button>
    </aside>
  );
}
