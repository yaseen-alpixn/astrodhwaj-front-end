import {
  Bell,
  ChevronRight,
  CircleHelp,
  ContactRound,
  Globe2,
  Lock,
  Star,
  UserRound,
  WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SettingsItem = {
  label: string;
  icon: LucideIcon;
  actionIcon: LucideIcon;
  src: string;
};

export type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

export const settingsProfile = {
  name: "Abhishek Pandey",
  phone: "+91 9480009900",
  imageSrc: "/images/profile.svg",
};

export const settingsSections: SettingsSection[] = [
  {
    title: "Account",
    items: [
      {
        label: "Edit Profile",
        icon: UserRound,
        actionIcon: ChevronRight,
        src: "/images/User.png",
      },
      {
        label: "My Wallet",
        icon: WalletCards,
        actionIcon: ChevronRight,
        src: "/images/Wallet.png",
      },
      {
        label: "Notification",
        icon: Bell,
        actionIcon: ChevronRight,
        src: "/images/Bell.png",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        label: "Language",
        icon: Globe2,
        actionIcon: ChevronRight,
        src: "/images/Earth.png",
      },
      {
        label: "Privacy & Security",
        icon: Lock,
        actionIcon: ChevronRight,
        src: "/images/Lock.png",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        label: "Help & FAQs",
        icon: CircleHelp,
        actionIcon: ChevronRight,
        src: "/images/QuestionMark.png",
      },
      {
        label: "Contact Support",
        icon: ContactRound,
        actionIcon: ChevronRight,
        src: "/images/Support.png",
      },
      {
        label: "Rate Our App",
        icon: Star,
        actionIcon: ChevronRight,
        src: "/images/AstrologerStar.png",
      },
    ],
  },
];

export const settingsAppInfo = {
  logoSrc: "/logo/astro-logo.svg",
  title: "AstroConnect",
  subtitle: "Your Personal Spiritual Guide",
  version: "Version 1.0.0",
};
