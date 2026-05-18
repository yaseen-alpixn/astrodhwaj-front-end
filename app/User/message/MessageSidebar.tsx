import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";

import { sidebarItems } from "./data";

export default function MessageSidebar() {
  return (
    <aside className="flex min-h-svh w-full flex-col border-r border-[#f0eaf7] bg-white px-4 py-5 shadow-[20px_0_60px_rgba(63,39,102,0.05)] md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-[290px] md:max-w-[290px] md:overflow-y-auto">
      <Link href="/user/home" className="flex items-center gap-3 px-2 py-1">
        <Image
          src="/logo/astro-logo.svg"
          alt="AstroConnect logo"
          width={60}
          height={60}
          className="h-[60px] w-[60px] rounded-full"
          unoptimized
        />
        <span className="text-[18px] font-semibold tracking-[-0.03em] text-[#181818]">
          AstroConnect
        </span>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-4">
        {sidebarItems.map(({ href, icon: Icon, label, active }) => (
          <Link
            key={label}
            href={href}
            className={
              active
                ? "flex items-center gap-3 rounded-[18px] bg-[#ecd9fb] px-5 py-4 text-[14px] font-medium text-[#8c279b]"
                : "flex items-center gap-3 rounded-[18px] px-5 py-4 text-[14px] font-medium text-[#3f3c45] transition-colors hover:bg-[#f7f3fc] hover:text-[#8c279b]"
            }
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-[20px] bg-[#f4dcff] p-4">
        <div className="overflow-hidden rounded-[12px]">
          <Image
            src="/images/profile.svg"
            alt="Donate with Pooja"
            width={240}
            height={170}
            className="h-[136px] w-full object-cover"
            unoptimized
          />
        </div>
        <Link href="/donate">
          <button
            type="button"
            className="mt-3 inline-flex w-full items-center justify-center rounded-[14px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white"
          >
            Donate With Pooja
          </button>
        </Link>
      </div>

      <button
        type="button"
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#ffe0e0] px-4 py-4 text-[13px] font-medium text-[#ff2b1f]"
      >
        <LogOut className="h-5 w-5" strokeWidth={2.2} />
        Logout
      </button>
    </aside>
  );
}
