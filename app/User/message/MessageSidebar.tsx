import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { clearSession } from "../../../services/api";

import { sidebarItems } from "./data";

export default function MessageSidebar() {
  const router = useRouter();

  return (
    <aside className="flex min-h-svh w-full flex-col border-r border-[#e5e7eb] bg-white px-4 py-5 shadow-[20px_0_60px_rgba(72,152,225,0.05)] md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-[290px] md:max-w-[290px] md:overflow-y-auto">
      <Link href="/User/home" className="flex items-center gap-3 px-2 py-1">
        <Image
          src="/logo/astro-logo.svg"
          alt="AstroDhwaj logo"
          width={60}
          height={60}
          className="h-[60px] w-[60px] rounded-full"
          unoptimized
        />
        <span className="text-[18px] font-semibold tracking-[-0.03em] text-[#181818]">
          AstroDhwaj
        </span>
      </Link>

      <nav className="mt-10 flex flex-1 flex-col gap-4">
        {sidebarItems.map(({ href, icon: Icon, label, active }) => (
          <Link
            key={label}
            href={href}
            className={
              active
                ? "flex items-center gap-3 rounded-[18px] bg-[#E8F4FF] px-5 py-4 text-[14px] font-medium text-[#4898E1]"
                : "flex items-center gap-3 rounded-[18px] px-5 py-4 text-[14px] font-medium text-[#3f3c45] transition-colors hover:bg-[#E8F4FF] hover:text-[#4898E1]"
            }
          >
            <Icon className="h-5 w-5 shrink-0 text-inherit" strokeWidth={2.2} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 rounded-[20px] bg-[#4898E1]/10 p-4">
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
            className="mt-3 inline-flex w-full items-center justify-center rounded-[14px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white"
          >
            Donate With Pooja
          </button>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => {
          clearSession("user");
          router.push("/login/user");
        }}
        className="mt-8 inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#ffe0e0] px-4 py-4 text-[13px] font-medium text-[#ff2b1f] w-full"
      >
        <LogOut className="h-5 w-5" strokeWidth={2.2} />
        Logout
      </button>
    </aside>
  );
}
