import TarotGuidanceSection from "@/app/User/TarotReading/TarotGuidanceSection";
import TarotHowItWorks from "@/app/User/TarotReading/TarotHowItWorks";
import TarotSpreadGrid from "@/app/User/TarotReading/TarotSpreadGrid";

export default function TarotReading() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(188,161,255,0.18),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fcf8ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-10">
        <TarotSpreadGrid />
        <TarotGuidanceSection />
        <TarotHowItWorks />
      </div>
    </main>
  );
}
