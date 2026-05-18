import { numerologyGrid } from "@/app/User/Numerology/numerologyData";

export default function NumerologyGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {numerologyGrid.map(({ id, value, detail, tertiary, filled }) => (
        <article
          key={id}
          className={
            filled
              ? "rounded-[16px] bg-[linear-gradient(135deg,#bca500_0%,#e55249_52%,#dd0d5d_100%)] px-6 py-4 text-center text-white shadow-[0_14px_34px_rgba(191,77,67,0.16)]"
              : "rounded-[16px] bg-[#eeeeef] px-6 py-4 text-center text-[#171717]"
          }
        >
          <p className="text-[16px] font-semibold leading-none tracking-[-0.04em]">
            {value}
          </p>
          <p className="mt-2 text-[16px] font-semibold leading-none">{detail}</p>
          {tertiary ? (
            <p className="mt-2 text-[12px] font-normal leading-none">{tertiary}</p>
          ) : null}
        </article>
      ))}
    </section>
  );
}
