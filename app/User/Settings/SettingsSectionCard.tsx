"use client";

import { settingsSections } from "@/app/User/Settings/settingsData";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

type SettingsSectionCardProps = {
  onEditProfile: () => void;
};

export default function SettingsSectionCard({ onEditProfile }: SettingsSectionCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAstrologer = pathname.startsWith("/Astrologer");

  const handleItemClick = (label: string) => {
    if (label === "Edit Profile") {
      onEditProfile();
    } else if (label === "My Wallet") {
      router.push(isAstrologer ? "/Astrologer/Wallet" : "/User/wallet");
    } else if (label === "Notification") {
      router.push("/User/Notification");
    } else if (label === "Contact Support") {
      router.push(isAstrologer ? "/Astrologer/SupportTickets" : "/User/SupportTickets");
    }
  };

  return (
    <div className="space-y-8">
      {settingsSections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-[#17151d]">
            {section.title}
          </h3>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-4 py-2 shadow-[0_22px_54px_rgba(72,152,225,0.08)] sm:px-5">
            {section.items.map(
              ({ label, src: src, actionIcon: ActionIcon }, index) => {
                const isClickable = ["Edit Profile", "My Wallet", "Notification", "Contact Support"].includes(label);

                return (
                  <div
                    key={label}
                    onClick={() => isClickable && handleItemClick(label)}
                    className={`flex items-center gap-4 py-4 ${
                      index === 0 ? "" : "border-t border-[#e5e7eb]"
                    } ${
                      isClickable
                        ? "cursor-pointer hover:bg-gray-50/60 active:scale-[0.99] transition rounded-[16px] px-2 -mx-2"
                        : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] text-[#4898E1]">
                      <Image
                        src={src}
                        alt={label + " settings icon"}
                        width={18}
                        height={18}
                        className="object-contain"
                      />
                    </div>

                    <span className="min-w-0 flex-1 text-[16px] font-semibold text-[#16151b]">
                      {label}
                    </span>

                    <ActionIcon
                      className="h-5 w-5 shrink-0 text-[#2a2a2f]"
                      strokeWidth={2.2}
                    />
                  </div>
                );
              }
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
