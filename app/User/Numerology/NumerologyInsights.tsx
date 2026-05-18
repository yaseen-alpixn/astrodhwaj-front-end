import {
  numerologyForm,
  numerologyInsights,
} from "@/app/User/Numerology/numerologyData";

export default function NumerologyInsights() {
  const NoteIcon = numerologyForm.noteIcon;

  return (
    <section className="space-y-7">
      <div className="inline-flex items-center gap-3 rounded-[14px] bg-[#ffd9d8] px-4 py-3 text-[#3e3845] shadow-[0_10px_26px_rgba(255,122,122,0.08)]">
        <NoteIcon
          className="h-5 w-5 shrink-0 text-[#ff1f10]"
          strokeWidth={2.2}
        />
        <span className="text-[13px] font-normal">
          {numerologyForm.noteText}
        </span>
      </div>

      <section className="rounded-[22px] bg-[linear-gradient(90deg,rgba(255,247,214,0.96)_0%,rgba(249,241,248,0.97)_54%,rgba(234,218,255,0.98)_100%)] px-5 py-3 shadow-[0_18px_40px_rgba(111,76,170,0.08)] sm:px-6">
        <h3 className="text-[18px] font-semibold tracking-[-0.04em] text-[#7420d3]">
          Understanding Your Numbers
        </h3>

        <div className="mt-5 space-y-5">
          {numerologyInsights.map(({ title, description }) => (
            <article key={title}>
              <h4 className="text-[16px] font-semibold tracking-[-0.03em] text-[#121212]">
                {title}
              </h4>
              <p className="mt-1 text-[13px] font-normal leading-[22px] text-[#6f6b67]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}
