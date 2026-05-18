import {
  CalendarDays,
  Hash,
  Heart,
  IdCard,
  Info,
  Star,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NumerologyMetric = {
  label: string;
  value: string;

  src: string;
};

export type NumerologyGridCell = {
  id: number;
  value: string;
  detail: string;
  tertiary?: string;
  filled: boolean;
};

export type NumerologyInsight = {
  title: string;
  description: string;
};

export const numerologyMetrics: NumerologyMetric[] = [
  { label: "Name Number", value: "5", src: "/images/Num1.png" },
  { label: "Soul Number", value: "7", src: "/images/Num2.png" },
  { label: "Personality", value: "7", src: "/images/Num3.png" },
  { label: "Life Path", value: "2", src: "/images/Num4.png" },
  { label: "Destiny", value: "9", src: "/images/NumStar.png" },
];

export const numerologyGrid: NumerologyGridCell[] = [
  { id: 1, value: "4", detail: "4", tertiary: "(1)", filled: true },
  { id: 2, value: "4", detail: "4", tertiary: "(1)", filled: true },
  { id: 3, value: "4", detail: "4", tertiary: "(1)", filled: true },
  { id: 4, value: "3", detail: "Empty", filled: false },
  { id: 5, value: "4", detail: "4", tertiary: "(1)", filled: true },
  { id: 6, value: "3", detail: "Empty", filled: false },
  { id: 7, value: "3", detail: "Empty", filled: false },
  { id: 8, value: "4", detail: "4", tertiary: "(1)", filled: true },
  { id: 9, value: "3", detail: "Empty", filled: false },
];

export const numerologyInsights: NumerologyInsight[] = [
  {
    title: "1. Name Number 5",
    description:
      "Freedom, Adventure, And Versatility. You Thrive On Change And New Experiences.",
  },
  {
    title: "2. Experiences. Soul Number 7",
    description:
      "Spirituality, Analysis, And Wisdom, You Seek Deeper Truths And Inner Knowledge.",
  },
  {
    title: "3. Life Path Number 2",
    description:
      "Cooperation, Harmony, And Diplomacy. You Excel In Partnerships And Team Environments.",
  },
];

export const numerologyForm = {
  title: "Enter Your Details",
  fields: [
    {
      label: "Full Name",
      placeholder: "Enter your full name",
      type: "text",
    },
    {
      label: "Date of Birth",
      placeholder: "DD / MM / YYYY",
      type: "text",
      icon: CalendarDays,
    },
  ],
  buttonLabel: "Calculate Number",
  buttonIcon: Hash,
  noteIcon: Info,
  noteText: "Numbers Show Frequency In Your Birth Date",
};
