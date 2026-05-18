import NumerologyFormCard from "@/app/User/Numerology/NumerologyFormCard";
import NumerologyGrid from "@/app/User/Numerology/NumerologyGrid";
import NumerologyInsights from "@/app/User/Numerology/NumerologyInsights";
import NumerologyMetricCards from "@/app/User/Numerology/NumerologyMetricCards";

export default function NumerologyPage() {
  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(193,170,255,0.18),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fcf9ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <NumerologyFormCard />
        <NumerologyMetricCards />
        <NumerologyGrid />
        <NumerologyInsights />
      </div>
    </main>
  );
}
