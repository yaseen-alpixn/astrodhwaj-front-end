import { numerologyMetrics } from "@/app/User/Numerology/numerologyData";
import type { NumerologyMetric } from "@/app/User/Numerology/numerologyData";
import Image from "next/image";

type NumerologyMetricCardsProps = {
  metrics?: NumerologyMetric[];
};

export default function NumerologyMetricCards({ metrics = numerologyMetrics }: NumerologyMetricCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-5 xl:grid-cols-5">
      {metrics.map(({ label, value, src: src }) => (
        <article
          key={label}
          className="rounded-[18px] bg-[linear-gradient(180deg,#0085FF_0%,#DD9A29_100%)] px-5 py-4 text-center text-white shadow-[0_16px_36px_rgba(127,16,154,0.2)]"
        >
          <div className="flex justify-center">
            <Image
              src={src}
              alt={label + " metric icon"}
              width={18}
              height={18}
              className="object-contain "
            />
          </div>
          <p className="mt-2 text-[16px] font-semibold leading-none tracking-[-0.04em]">
            {value}
          </p>
          <p className="mt-2 text-[11px] font-medium leading-none whitespace-nowrap">
            {label}
          </p>
        </article>
      ))}
    </section>
  );
}
