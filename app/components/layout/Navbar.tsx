"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavbarProps = {
  overlay?: boolean;
};

const navLinks = [
  { href: "/service", label: "Service" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/for-astrologers", label: "For Astrologers" },
];

export default function Navbar({ overlay = false }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-50 bg-white/90 backdrop-blur-md"
          : "sticky top-0 z-50 bg-white/95 backdrop-blur-sm"
      }
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 py-3 sm:px-8 lg:px-10">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold tracking-tight text-[#171717]"
        >
          <Image
            src="/logo/astro-logo.svg"
            alt="AstroConnect logo"
            width={50}
            height={50}
            className="h-10 w-10 rounded-full sm:h-[50px] sm:w-[50px]"
            unoptimized
          />
          <span className="text-lg sm:text-2xl">AstroConnect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 flex-wrap">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium whitespace-nowrap text-[#171717] transition-colors hover:text-[#7a1eb1]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/donate"
            className="rounded-xl bg-[#7a1eb1] px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Donate
          </Link>
          <Link
            href="/login"
            className="rounded-xl bg-gradient-to-r from-[#d2a619] to-[#7a1eb1] px-6 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation menu"
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full border border-black/10"
        >
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
            <span className="block h-0.5 w-5 bg-black" />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-black/10 bg-white px-5 py-4">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-[#171717] hover:bg-[#f7f3fa] hover:text-[#7a1eb1]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/donate"
              onClick={() => setIsOpen(false)}
              className="w-full text-center rounded-xl bg-[#7a1eb1] px-5 py-3 text-sm font-semibold text-white"
            >
              Donate
            </Link>
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center rounded-xl bg-gradient-to-r from-[#d2a619] to-[#7a1eb1] px-5 py-3 text-sm font-semibold text-white"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
