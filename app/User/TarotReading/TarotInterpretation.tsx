"use client";

interface TarotInterpretationProps {
  interpretation: string;
}

export default function TarotInterpretation({ interpretation }: TarotInterpretationProps) {
  // Split on newlines, filter blanks
  const paragraphs = interpretation
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="relative overflow-hidden rounded-[22px] border border-[#f4c500]/30 bg-gradient-to-br from-[#fffbea] via-[#fff8f0] to-[#f0f5ff] px-5 py-6 shadow-[0_18px_50px_rgba(107,23,215,0.10)] sm:px-7 sm:py-7">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#f4c500]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-[#4898E1]/10 blur-3xl"
      />

      {/* Header */}
      <div className="relative mb-5 flex items-center justify-center gap-3">
        <span className="text-[20px] text-[#f4c500]" aria-hidden="true">✦</span>
        <h2 className="text-[17px] font-bold tracking-[-0.03em] text-[#18161e]">
          Your Reading
        </h2>
        <span className="text-[20px] text-[#f4c500]" aria-hidden="true">✦</span>
      </div>

      {/* Divider */}
      <div className="relative mb-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f4c500]/40 to-transparent" />
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#f4c500]/80">
          Oracle Speaks
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#f4c500]/40 to-transparent" />
      </div>

      {/* Interpretation paragraphs */}
      <div className="relative space-y-3.5">
        {paragraphs.map((para, i) => {
          if (para.startsWith("### ")) {
            return (
              <h3
                key={i}
                className="text-[16px] font-bold text-[#6b17d7] pt-4 mt-6 first:mt-0 flex items-center gap-1.5"
              >
                {para.replace("### ", "")}
              </h3>
            );
          }
          if (para.startsWith("- ")) {
            return (
              <p
                key={i}
                className="text-[13.5px] font-normal leading-[1.75] text-[#3a3640] pl-5 relative before:content-['✦'] before:absolute before:left-1 before:text-[#f4c500]/80 before:text-[10px] before:top-[1px]"
              >
                {para.replace("- ", "")}
              </p>
            );
          }
          if (para === "---") {
            return (
              <hr
                key={i}
                className="my-5 border-[#e5e7eb]"
              />
            );
          }
          return (
            <p
              key={i}
              className="text-[13.5px] font-normal leading-[1.75] text-[#3a3640]"
            >
              {para}
            </p>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="relative mt-5 text-center text-[11px] font-medium text-[#6f6b77]/70">
        ☽ &nbsp;For reflection and guidance only &nbsp;☾
      </p>
    </div>
  );
}
