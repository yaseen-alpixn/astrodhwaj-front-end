import { settingsSections } from "@/app/User/Settings/settingsData";
import Image from "next/image";
export default function SettingsSectionCard() {
  return (
    <div className="space-y-8">
      {settingsSections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-[#17151d]">
            {section.title}
          </h3>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-4 py-2 shadow-[0_22px_54px_rgba(72,152,225,0.08)] sm:px-5">
            {section.items.map(
              ({ label, src: src, actionIcon: ActionIcon }, index) => (
                <div
                  key={label}
                  className={
                    index === 0
                      ? "flex items-center gap-4 py-4"
                      : "flex items-center gap-4 border-t border-[#e5e7eb] py-4"
                  }
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-r from-[#FFF7CC] to-[#F3E1FF] text-[#4898E1]">
                    <Image
                      src={src}
                      alt={label + " settings icon"}
                      width={18}
                      height={18}
                      className="object-contain "
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
              ),
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
