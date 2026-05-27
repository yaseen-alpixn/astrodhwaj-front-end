"use client";

import { useState } from "react";
import SettingsAppCard from "@/app/User/Settings/SettingsAppCard";
import SettingsProfileCard from "@/app/User/Settings/SettingsProfileCard";
import SettingsSectionCard from "@/app/User/Settings/SettingsSectionCard";
import EditProfileForm from "@/app/User/Settings/EditProfileForm";

export default function SettingPageContent() {
  const [view, setView] = useState<"list" | "edit">("list");

  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(198,177,255,0.18),transparent_30%),linear-gradient(180deg,#ffffff_0%,#fcf9ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-8">
        {view === "list" ? (
          <>
            <SettingsProfileCard />
            <SettingsSectionCard onEditProfile={() => setView("edit")} />
            <SettingsAppCard />
          </>
        ) : (
          <EditProfileForm onBack={() => setView("list")} />
        )}
      </div>
    </main>
  );
}
