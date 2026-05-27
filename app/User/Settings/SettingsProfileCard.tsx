"use client";

import { useEffect, useState } from "react";
import { getProfile as getUserProfile } from "@/services/user.service";
import { getProfile as getAstroProfile } from "@/services/astrologer.service";
import { usePathname } from "next/navigation";
import Avatar from "@/app/components/common/Avatar";

type AstrologerSettingsProfile = {
  display_name?: string;
  user?: {
    full_name?: string;
    phone?: string;
    email?: string;
    avatar_url?: string;
  };
};

type UserSettingsProfile = {
  full_name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
};

export default function SettingsProfileCard() {
  const pathname = usePathname();
  const isAstrologer = pathname.startsWith("/Astrologer");

  const [profile, setProfile] = useState({
    imageSrc: null as string | null,
    name: "User",
    phone: "-",
  });

  useEffect(() => {
    const fetchProfile = isAstrologer ? getAstroProfile : getUserProfile;
    fetchProfile()
      .then((response) => {
        if (isAstrologer) {
          const data = response.data as AstrologerSettingsProfile;
          setProfile({
            imageSrc: data.user?.avatar_url || null,
            name: data.display_name || data.user?.full_name || "Astrologer",
            phone: data.user?.phone || data.user?.email || "-",
          });
        } else {
          const data = response.data as UserSettingsProfile;
          setProfile({
            imageSrc: data.avatar_url || null,
            name: data.full_name || "User",
            phone: data.phone || data.email || "-",
          });
        }
      })
      .catch(() => undefined);
  }, [isAstrologer]);

  return (
    <section className="rounded-[18px] bg-[#E1F4FF] px-4 py-4 shadow-[0_18px_44px_rgba(124,89,187,0.08)] sm:px-5">
      <div className="flex items-center gap-4">
        <Avatar
          src={profile.imageSrc}
          name={profile.name}
          size={68}
          className="h-[68px] w-[68px]"
        />

        <div className="min-w-0">
          <h2 className="truncate text-[16px] font-semibold tracking-[-0.04em] text-[#17151d]">
            {profile.name}
          </h2>
          <p className="mt-1 text-[12px] font-normal text-[#29242f]">
            {profile.phone}
          </p>
        </div>
      </div>
    </section>
  );
}
