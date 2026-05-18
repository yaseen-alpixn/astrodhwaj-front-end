import {
  BriefcaseBusiness,
  HeartHandshake,
  Shuffle,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TarotSlot = {
  id: number;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type TarotCategory = {
  title: string;
  description: string;

  gradientClassName: string;
  iconWrapClassName: string;
  src: string;
};

export const tarotSlots: TarotSlot[] = [
  { id: 1 },
  {
    id: 2,
    title: "The Cups",
    imageSrc: "/images/Tarot1TheCups.png",
    imageAlt: "The Cups tarot card",
  },
  { id: 3 },
  { id: 4 },
  {
    id: 5,
    title: "Ace Of Pentacles",
    imageSrc: "/images/Tarot2AceofPentacles.png",
    imageAlt: "Ace of Pentacles tarot card",
  },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  {
    id: 9,
    title: "Ace Of Wands",
    imageSrc: "/images/Tarot3AceofWands.png",
    imageAlt: "Ace of Wands tarot card",
  },
];

export const tarotCategories: TarotCategory[] = [
  {
    title: "Love & Relationships",
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    src: "/images/Love.png",
    gradientClassName:
      "bg-[linear-gradient(90deg,#2574c7_0%,#6b17d7_58%,#7413d5_100%)]",
    iconWrapClassName: "bg-[rgba(255,255,255,0.16)]",
  },
  {
    title: "Career & Success",
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    src: "/images/Career.png",
    gradientClassName:
      "bg-[linear-gradient(90deg,#c9a01d_0%,#db6c32_42%,#ed3f57_72%,#df0c68_100%)]",
    iconWrapClassName: "bg-[rgba(255,255,255,0.16)]",
  },
  {
    title: "Health & Wellness",
    description: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    src: "/images/Health.png",
    gradientClassName:
      "bg-[linear-gradient(90deg,#1be5e1_0%,#18cad4_48%,#0f8db2_100%)]",
    iconWrapClassName: "bg-[rgba(255,255,255,0.16)]",
  },
];

export const tarotSteps = [
  "Choose A Category That Resonates With Your Question.",
  "Select 3 Cards That Call Out To You.",
  "Receive Personalized Guidance And Insights.",
];

export const tarotIntro = {
  eyebrowIcon: Sparkles,
  title: "What Guidance Do You Seek?",
  description: "Choose A Category For Your Reading",
  actionIcon: Shuffle,
};
