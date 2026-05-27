import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  Building2,
  Hand,
  Hash,
  Headphones,
  Home,
  MessageSquareText,
  Settings,
  Sparkles,
  Users,
  WalletCards,
} from "lucide-react";

export type SidebarItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

export type Conversation = {
  id: number;
  name: string;
  preview: string;
  time?: string;
  unread?: boolean;
  online?: boolean;
};

export type ChatMessage = {
  id: number;
  content: string;
  time: string;
  sender: "astrologer" | "user";
};

export const sidebarItems: SidebarItem[] = [
  { href: "/User/home", icon: Home, label: "Home", active: true },
  { href: "/User/Astrologers", icon: Users, label: "Astrologers" },
  { href: "/User/wallet", icon: WalletCards, label: "My Wallet" },
  { href: "/User/message", icon: MessageSquareText, label: "Messages" },
  { href: "#", icon: Headphones, label: "Free Services" },
  { href: "/User/kundali", icon: Sparkles, label: "Kundali" },
  { href: "/User/Numerology", icon: Hash, label: "Numerology" },
  { href: "/User/TarotReading", icon: BookOpenText, label: "Tarot Reading" },
  { href: "/User/ReikiHealing", icon: Hand, label: "Reiki Healing" },
  { href: "/User/Vastu", icon: Building2, label: "Vastu" },
  { href: "/User/courses", icon: BookOpenText, label: "Courses" },
  { href: "/User/Settings", icon: Settings, label: "Settings" },
];

export const conversations: Conversation[] = [
  {
    id: 1,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
    online: true,
  },
  {
    id: 2,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    time: "2.34 PM",
    online: true,
  },
  {
    id: 3,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
  },
  {
    id: 4,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
  },
  {
    id: 5,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    time: "2.34 PM",
  },
  {
    id: 6,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
  },
  {
    id: 7,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    time: "2.34 PM",
  },
  {
    id: 8,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    time: "2.34 PM",
  },
  {
    id: 9,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
  },
  {
    id: 10,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    time: "2.34 PM",
  },
  {
    id: 11,
    name: "Astrologer Priya Sharma",
    preview: "Hello! Welcome To The...",
    unread: true,
  },
];

export const messages: ChatMessage[] = [
  {
    id: 1,
    content: "Hello! Welcome To The Session. How Can I Help You Today?",
    time: "2.34 PM",
    sender: "astrologer",
  },
  {
    id: 2,
    content: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    time: "2.36 PM",
    sender: "user",
  },
  {
    id: 3,
    content: "Hello! Welcome To The Session. How Can I Help You Today?",
    time: "2.34 PM",
    sender: "astrologer",
  },
  {
    id: 4,
    content: "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit.",
    time: "2.36 PM",
    sender: "user",
  },
];
