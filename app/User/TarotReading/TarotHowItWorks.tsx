import { tarotSteps } from "@/app/User/TarotReading/tarotData";

export default function TarotHowItWorks() {
  return (
    <section className="rounded-[20px] bg-[linear-gradient(90deg,rgba(255,248,216,0.9)_0%,rgba(244,234,248,0.95)_62%,rgba(236,227,255,0.95)_100%)] px-4 py-5 shadow-[0_18px_40px_rgba(111,76,170,0.08)] sm:px-6">
      <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#7b18cb]">
        How It Works:
      </h3>
      <ol className="mt-3 space-y-2.5 text-[13px] font-normal text-[#6f6473]">
        {tarotSteps.map((step, index) => (
          <li key={step}>
            <span className="mr-1 font-medium text-[#b444d7]">
              {index + 1}.
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
