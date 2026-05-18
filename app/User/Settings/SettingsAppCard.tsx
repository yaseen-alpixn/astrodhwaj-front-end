import Image from "next/image";

import { settingsAppInfo } from "@/app/User/Settings/settingsData";

export default function SettingsAppCard() {
  return (
    <section className="rounded-[24px] border border-[#f0eaf7] bg-white px-4 py-8 text-center shadow-[0_22px_54px_rgba(81,48,125,0.08)] sm:px-6 sm:py-10">
      <Image
        src={settingsAppInfo.logoSrc}
        alt={settingsAppInfo.title}
        width={80}
        height={80}
        className="mx-auto h-[88px] w-[88px] rounded-full object-contain"
        unoptimized
      />

      <h3 className="mt-1 text-[16px] font-semibold tracking-[-0.04em] text-[#17151d]">
        {settingsAppInfo.title}
      </h3>
      <p className="mt-1 text-[12px] font-normal text-[#27242c]">
        {settingsAppInfo.subtitle}
      </p>
      <p className="mt-1 text-[12px] font-normal text-[#4c4953]">
        {settingsAppInfo.version}
      </p>
    </section>
  );
}
