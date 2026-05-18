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
        src: "/images/twoWithdraw (3).png",
      },
      {
        label: "My Wallet",
        icon: WalletCards,
        actionIcon: ChevronRight,
        src: "/images/twoWithdraw (2).png",
      },
      {
        label: "Notification",
        icon: Bell,
        actionIcon: ChevronRight,
        src: "/images/twoBell.png",
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
        src: "/images/twoEarth.png",
      },
      {
        label: "Privacy & Security",
        icon: Lock,
        actionIcon: ChevronRight,
        src: "/images/twoLock.png",
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
        src: "/images/twoQuestion.png",
      },
      {
        label: "Contact Support",
        icon: ContactRound,
        actionIcon: ChevronRight,
        src: "/images/twoSupport.png",
      },
      {
        label: "Rate Our App",
        icon: Star,
        actionIcon: ChevronRight,
        src: "/images/twoWithdraw (4).png",
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
