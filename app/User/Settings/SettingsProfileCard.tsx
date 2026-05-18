import Image from "next/image";

import { settingsProfile } from "@/app/User/Settings/settingsData";

export default function SettingsProfileCard() {
  return (
    <section className="rounded-[18px] bg-[#E1F4FF] px-4 py-4 shadow-[0_18px_44px_rgba(124,89,187,0.08)] sm:px-5">
      <div className="flex items-center gap-4">
        <Image
          src={settingsProfile.imageSrc}
          alt={settingsProfile.name}
          width={68}
          height={68}
          className="h-[68px] w-[68px] shrink-0 rounded-full object-cover"
          unoptimized
        />

        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold tracking-[-0.04em] text-[#17151d]">
            {settingsProfile.name}
          </h2>
          <p className="mt-1 text-[12px] font-normal text-[#29242f]">
            {settingsProfile.phone}
          </p>
        </div>
      </div>
    </section>
  );
}
