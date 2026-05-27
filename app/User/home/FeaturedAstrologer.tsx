"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";

import { getAstrologers, type Astrologer } from "@/services/user.service";
import SeekerAstrologerProfileModal from "./SeekerAstrologerProfileModal";

function statusClassName(status?: string) {
  if (status === "busy") return "text-[#e2ae00]";
  if (status === "offline") return "text-[#7c7c84]";
  return "text-[#1eb24a]";
}

export default function FeaturedAstrologer({ limit = 6 }: { limit?: number }) {
  const [astrologers, setAstrologers] = useState<Astrologer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAstrologerId, setSelectedAstrologerId] = useState<string | null>(null);

  useEffect(() => {
    getAstrologers({ limit })
      .then((response) => {
        setAstrologers(response.data || []);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load astrologers"))
      .finally(() => setLoading(false));
  }, [limit]);

  return (
    <section className="mt-12 pb-6 w-full">
      <div className="mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-1 text-[#171717]">
          <Star className="h-5 w-5 text-[#4898E1]" strokeWidth={2} />
          <h2 className="text-[18px] font-semibold tracking-[-0.04em]">
            {limit === 6 ? "Featured Astrologers" : "Our Astrologers"}
          </h2>
        </div>

        {/* GRID */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:grid-cols-6">
          {loading && (
            <div className="rounded-[22px] border border-[#ece8f1] bg-white p-4 text-[13px] text-[#2d2d2d] shadow-[0_12px_40px_rgba(86,63,118,0.05)] col-span-full text-center">
              Loading...
            </div>
          )}
          {!loading && error && (
            <div className="rounded-[22px] border border-[#ece8f1] bg-white p-4 text-[13px] text-red-500 shadow-[0_12px_40px_rgba(86,63,118,0.05)] col-span-full text-center">
              {error}
            </div>
          )}
          {!loading && !error && astrologers.length === 0 && (
            <div className="rounded-[22px] border border-[#ece8f1] bg-white p-4 text-[13px] text-gray-500 shadow-[0_12px_40px_rgba(86,63,118,0.05)] col-span-full text-center">
              No astrologers found.
            </div>
          )}
          {astrologers.map((astrologer) => (
            <article
              key={astrologer.id}
              className="rounded-[22px] border border-[#ece8f1] bg-white p-4 shadow-[0_12px_40px_rgba(86,63,118,0.05)] flex flex-col"
            >
              {/* PROFILE IMAGE WITH DYNAMIC FALLBACK */}
              <div className="flex items-center gap-4">
                {astrologer.avatar_url ? (
                  <Image
                    src={astrologer.avatar_url}
                    alt={astrologer.display_name}
                    width={72}
                    height={72}
                    className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-[60px] w-[60px] sm:h-[70px] sm:w-[70px] rounded-full bg-gradient-to-tr from-[#0180D5] to-[#4898E1] text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                    {astrologer.display_name ? astrologer.display_name.charAt(0).toUpperCase() : "A"}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="mt-4 sm:mt-5 flex flex-col flex-grow ">
                <h3 className="text-[16px] font-semibold text-[#141414]">
                  {astrologer.display_name}
                </h3>

                <p className="mt-2 text-[13px] font-normal leading-[22px] text-[#2d2d2d] tracking-tight line-clamp-2 min-h-[44px]">
                  {(astrologer.expertise || []).join(", ")}
                </p>

                <div className="my-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6d6d75]">
                    <Star className="h-[14px] w-[14px] sm:h-[16px] sm:w-[16px] fill-[#f4c400] text-[#f4c400]" />
                    {Number(astrologer.rating || 0).toFixed(1)}
                  </span>

                  <span className="text-[11px] text-[#7b7b83]">|</span>

                  <span className="text-[13px] font-medium text-[#4898E1]">
                    Rs{astrologer.per_minute_rate || 0}/Min
                  </span>

                  <span className="text-[11px] text-[#7b7b83]">|</span>

                  <span
                    className={`text-[11px] font-medium ${statusClassName(astrologer.status || astrologer.availability?.status)}`}
                  >
                    {(astrologer.status || astrologer.availability?.status || "online").replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>

                {/* BUTTON */}
                <button
                  type="button"
                  onClick={() => setSelectedAstrologerId(astrologer.id)}
                  className="mt-auto inline-flex h-8 sm:h-10 w-full items-center justify-center rounded-[12px] border border-[#4898E1] bg-white px-4 text-[13px] font-medium text-[#171717] transition-colors hover:bg-[#E8F4FF] hover:text-[#0180D5]"
                >
                  View Profile
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedAstrologerId && (
        <SeekerAstrologerProfileModal
          id={selectedAstrologerId}
          onClose={() => setSelectedAstrologerId(null)}
        />
      )}
    </section>
  );
}
