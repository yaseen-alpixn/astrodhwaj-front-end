import AstrologerHeroSection from "./AstrologerHeroSection";
import ConsultationList from "./ConsultationList";

import EarningsBars from "./EarningBars";
export default function AstrologerHome() {
  return (
    <div className="flex w-full flex-col gap-3 p-4 md:p-6">
      <AstrologerHeroSection />

      <ConsultationList />

      <EarningsBars />
    </div>
  );
}
