"use client";

import { useEffect, useState } from "react";
import { getProfile, type AstrologerProfile } from "@/services/astrologer.service";
import ProfileCard from "./ProfileCard";
import AboutSection from "./AboutSection";
import EducationSection from "./EducationSection";
import LanguagesSection from "./LanguagesSection";
import SkillsSection from "./SkillsSection";
import ContactInfo from "./ContactInfo";

export default function Profile() {
  const [profile, setProfile] = useState<AstrologerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data);
      })
      .catch((err) => console.error("Failed to fetch profile", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-[350px] items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-[#0085FF] border-t-transparent mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full flex flex-col gap-6 p-4 md:p-6">
      <ProfileCard profile={profile} />

      <AboutSection bio={profile?.bio} experienceYears={profile?.experience_years} />
      <hr className="border-gray-300" />

      {/* Responsive Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <EducationSection />
        <LanguagesSection languages={profile?.languages} />
        <SkillsSection expertise={profile?.expertise} />
      </div>

      <hr className="border-gray-300" />

      <ContactInfo phone={profile?.user?.phone} email={profile?.user?.email} />

      <hr className="border-gray-300" />
    </div>
  );
}
