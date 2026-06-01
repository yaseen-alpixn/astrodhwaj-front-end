"use client";

import { useState, useEffect } from "react";
import type { TarotCard } from "@/services/tarot.service";

interface TarotCardFlipProps {
  card: TarotCard;
  index: number;
  revealed: boolean;
}

// Placeholder SVG for when Cloudinary image fails to load
function buildPlaceholderSvg(name: string, index: number): string {
  const hues = [270, 45, 190];
  const hue = hues[index % hues.length];
  const initial = name?.[0]?.toUpperCase() ?? "✦";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
    <defs>
      <linearGradient id="g${index}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:hsl(${hue},40%,20%)" />
        <stop offset="100%" style="stop-color:hsl(${hue + 30},35%,10%)" />
      </linearGradient>
    </defs>
    <rect width="300" height="450" fill="url(#g${index})" rx="14"/>
    <rect x="10" y="10" width="280" height="430" fill="none" stroke="hsl(${hue},50%,50%)" stroke-width="1" rx="10" stroke-dasharray="6 4" opacity="0.4"/>
    <text x="150" y="210" font-family="serif" font-size="80" fill="hsl(${hue},60%,65%)" text-anchor="middle" opacity="0.7">${initial}</text>
    <text x="150" y="270" font-family="serif" font-size="14" fill="hsl(${hue},40%,70%)" text-anchor="middle" opacity="0.5">✦ ✦ ✦</text>
  </svg>`.trim();
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

const POSITION_LABELS: Record<string, string> = {
  past: "Past",
  present: "Present",
  future: "Future",
  focus: "Focus",
};

const POSITION_COLORS: Record<string, string> = {
  past: "from-[#6b17d7] to-[#0D42AD]",
  present: "from-[#0180D5] to-[#4898E1]",
  future: "from-[#0040C1] to-[#6b17d7]",
  focus: "from-[#4898E1] to-[#0D42AD]",
};

const CARD_BACK_SVG = `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0D42AD" />
      <stop offset="100%" style="stop-color:#6b17d7" />
    </linearGradient>
  </defs>
  <rect width="300" height="450" fill="url(#bg)" rx="14"/>
  <rect x="12" y="12" width="276" height="426" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" rx="10" stroke-dasharray="8 5"/>
  <circle cx="150" cy="225" r="80" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  <circle cx="150" cy="225" r="55" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <text x="150" y="240" font-family="serif" font-size="55" fill="rgba(255,255,255,0.35)" text-anchor="middle">✦</text>
  <text x="150" y="290" font-family="serif" font-size="12" fill="rgba(255,255,255,0.25)" text-anchor="middle" letter-spacing="4">· · · · ·</text>
</svg>`)}`;

export default function TarotCardFlip({ card, index, revealed }: TarotCardFlipProps) {
  const [flipped, setFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const positionKey = card.position?.toLowerCase() ?? "focus";
  const positionLabel = POSITION_LABELS[positionKey] ?? card.position;
  const positionGradient = POSITION_COLORS[positionKey] ?? POSITION_COLORS.focus;
  const placeholder = buildPlaceholderSvg(card.name, index);

  // Flip in with a staggered delay after revealed
  useEffect(() => {
    if (!revealed) {
      setFlipped(false);
      setImgError(false);
      return;
    }
    const timer = setTimeout(() => setFlipped(true), 300 + index * 250);
    return () => clearTimeout(timer);
  }, [revealed, index]);

  return (
    <div
      className="flex flex-col items-center gap-3"
      style={{ perspective: "1000px" }}
    >
      {/* Position Badge */}
      <span
        className={`inline-flex items-center rounded-full bg-gradient-to-r ${positionGradient} px-4 py-1 text-[12px] font-semibold uppercase tracking-widest text-white shadow`}
      >
        {positionLabel}
      </span>

      {/* Flip Card */}
      <div
        className="relative w-full"
        style={{
          height: "260px",
          transformStyle: "preserve-3d",
          transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* BACK */}
        <div
          className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_20px_50px_rgba(40,13,82,0.22)] border-[4px] border-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={CARD_BACK_SVG}
            alt="Card back"
            className="h-full w-full object-cover"
          />
        </div>

        {/* FRONT */}
        <div
          className="absolute inset-0 rounded-[18px] overflow-hidden shadow-[0_20px_50px_rgba(40,13,82,0.22)] border-[4px] border-white"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgError || !card.image ? placeholder : card.image}
            alt={`Tarot card: ${card.name}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      </div>

      {/* Card Info — only visible after flip */}
      <div
        className="w-full text-center transition-all duration-500"
        style={{
          opacity: flipped ? 1 : 0,
          transform: flipped ? "translateY(0)" : "translateY(8px)",
        }}
      >
        <p className="text-[15px] font-bold tracking-[-0.02em] text-[#18161e]">
          {card.name}
        </p>
        <span
          className={`mt-1 inline-block rounded-full px-3 py-0.5 text-[11px] font-medium ${
            card.orientation === "reversed"
              ? "bg-[#ffe4e1] text-[#c0392b]"
              : "bg-[#e8f4ff] text-[#0D42AD]"
          }`}
        >
          {card.orientation === "reversed" ? "↓ Reversed" : "↑ Upright"}
        </span>
        <p className="mt-1.5 text-[12px] text-[#6f6b77] leading-relaxed px-1">
          {card.meaning}
        </p>
      </div>
    </div>
  );
}
