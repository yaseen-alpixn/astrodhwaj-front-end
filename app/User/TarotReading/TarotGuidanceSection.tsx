import { tarotCategories, tarotIntro } from "@/app/User/TarotReading/tarotData";
import Image from "next/image";
export default function TarotGuidanceSection() {
  const EyebrowIcon = tarotIntro.eyebrowIcon;
  const ActionIcon = tarotIntro.actionIcon;

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="inline-flex h-15 w-15 items-center justify-center rounded-full bg-[#f4c500] text-white shadow-[0_14px_30px_rgba(244,197,0,0.3)]">
          <EyebrowIcon className="h-8 w-8" strokeWidth={2.2} />
        </div>

        <div>
          <h3 className="text-[20px] font-bold tracking-[-0.04em] text-[#18161e]">
            {tarotIntro.title}
          </h3>
          <p className="mt-1 text-[13px] font-normal text-[#6f6b77]">
            {tarotIntro.description}
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {tarotCategories.map(
          ({
            title,
            description,
            src: src,
            gradientClassName,
            iconWrapClassName,
          }) => (
            <article
              key={title}
              className={`flex items-center gap-3 rounded-[18px] px-4 py-4 text-white shadow-[0_18px_40px_rgba(20,12,46,0.18)] sm:px-5 ${gradientClassName}`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconWrapClassName}`}
              >
                <Image
                  src={src}
                  alt={title + " icon"}
                  width={18}
                  height={18}
                  className="object-contain "
                />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-[16px] font-semibold tracking-[-0.03em]">
                  {title}
                </h4>
                <p className="truncate text-[12px] font-normal text-white/85">
                  {description}
                </p>
              </div>

              <div className="shrink-0 text-white/95">
                <ActionIcon className="h-5 w-5" strokeWidth={2.2} />
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  );
}
