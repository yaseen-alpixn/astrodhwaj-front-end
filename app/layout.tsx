import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import AppShell from "./components/layout/AppShell";
import { NetworkProvider } from "@/context/network-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AstroDhwaj",
  description: "AstroDhwaj connects seekers with astrologers.",
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // choose what you need
  variable: "--font-dm-sans",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-[#171717]">
        <NetworkProvider>
          <AppShell>{children}</AppShell>
        </NetworkProvider>
      </body>
    </html>
  );
}
