import { tarotSteps } from "@/app/User/TarotReading/tarotData";

export default function TarotHowItWorks() {
  return (
    <section className="rounded-[20px] bg-gradient-to-r from-[#CCF7FF] to-[#E1E6FF]px-4 py-5 shadow-[0_18px_40px_rgba(111,76,170,0.08)] sm:px-6">
      <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#4898E1]">
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
