"use client";

import { useState } from "react";
import Image from "next/image";
import { Bell, Menu, Search, X } from "lucide-react";
import Link from "next/link";

import DashboardSidebar from "@/app/User/DashboardSidebar";

function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="border border-[#efe8f7] bg-white px-3 sm:px-5 lg:px-5 py-3 lg:py-4 shadow-[0_14px_44px_rgba(84,56,120,0.06)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div className="flex items-center justify-between lg:justify-start w-full">
            {/* Menu Button */}
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setIsMenuOpen(true)}
              className="mr-2 inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-black/18 bg-white text-black hover:bg-[#faf7ff] md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={2.1} />
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/images/profile.svg"
                alt="Abhishek Pandey"
                width={56}
                height={56}
                className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-full object-cover"
                unoptimized
              />

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-[#343434]">
                  Welcome!
                </p>
                <h1 className="truncate text-[20px] font-bold tracking-[-0.04em] text-[#151515]">
                  Abhishek Pandey
                </h1>
              </div>
            </div>

            {/* Notification (mobile only right side) */}
            <button
              type="button"
              aria-label="Notifications"
              className="ml-auto md:hidden relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/18 bg-white text-black hover:bg-[#faf7ff]"
            >
              <Link href="/user/Notification">
                <Bell className="h-5 w-5" strokeWidth={2.1} />
              </Link>
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff2b1f]" />
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto">
            {/* SEARCH */}
            <label className="flex items-center gap-2 sm:gap-3 w-full lg:w-auto flex-1 lg:max-w-[400px] rounded-xl border border-black/18 bg-white px-3 sm:px-4">
              <Search className="h-3 w-6 sm:h-5 sm:w-5 text-black" />
              <input
                type="text"
                placeholder="Search here..."
                className="w-full bg-transparent h-[35px] sm:h-[40px] lg:h-[46px] text-[13px] font-normal leading-[22px] text-[#1d1d1d] outline-none placeholder:text-[#444]/80"
              />
            </label>

            {/* Notification (desktop only) */}
            <button
              type="button"
              aria-label="Notifications"
              className="hidden md:inline-flex relative h-12 w-12 items-center justify-center rounded-full border border-black/18 bg-white text-black hover:bg-[#faf7ff]"
            >
              <Link href="/user/Notification">
                <Bell className="h-5 w-5" strokeWidth={2.1} />
              </Link>
              <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-[#ff2b1f]" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />

          <div className="relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white">
            <div className="flex items-center justify-end border-b px-3 py-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#f7f3fc]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <DashboardSidebar mobile onNavigate={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardHeader;
