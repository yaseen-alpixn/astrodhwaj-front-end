"use client";

import Image from "next/image";

type AvatarProps = {
  src?: string | null;
  name: string;
  size?: number; // Size in px
  className?: string;
};

export default function Avatar({ src, name, size = 48, className = "" }: AvatarProps) {
  // Check if there is a custom image url saved
  const hasImage =
    src &&
    src.trim() !== "" &&
    !src.includes("profile.svg") &&
    !src.includes("AudioCallpicture.jpg") &&
    !src.includes("default");

  if (hasImage) {
    return (
      <Image
        src={src!}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover shrink-0 border border-gray-100/50 ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
        unoptimized
      />
    );
  }

  // Fallback to name's first letter placeholder
  const firstLetter = name ? name.trim().charAt(0).toUpperCase() : "U";
  
  // Custom harmonic background gradients based on letter code
  const colorIndex = firstLetter.charCodeAt(0) % 5;
  const colors = [
    "from-[#0085FF] to-[#3aa2ff] text-white",
    "from-[#7013b7] to-[#9934e8] text-white",
    "from-[#f4c400] to-[#ffd73b] text-gray-900",
    "from-[#00c6ff] to-[#0072ff] text-white",
    "from-[#ff4b2b] to-[#ff416c] text-white",
  ];
  const colorClass = colors[colorIndex];

  return (
    <div
      className={`rounded-full flex items-center justify-center font-extrabold shrink-0 bg-gradient-to-br shadow-sm ${colorClass} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${Math.max(12, size * 0.45)}px`,
      }}
    >
      {firstLetter}
    </div>
  );
}
