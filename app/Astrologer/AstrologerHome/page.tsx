"use client";

import { useEffect, useState } from "react";

import AstrologerHeroSection from "./AstrologerHeroSection";
import ConsultationList from "./ConsultationList";

import EarningsBars from "./EarningBars";
import { getDashboard, type AstrologerDashboard } from "@/services/astrologer.service";
export default function AstrologerHome() {
  const [dashboard, setDashboard] = useState<AstrologerDashboard | null>(null);

  useEffect(() => {
    getDashboard().then((response) => setDashboard(response.data)).catch(() => undefined);
  }, []);

  return (
    <div className="flex w-full flex-col gap-3 p-4 md:p-6">
      <AstrologerHeroSection stats={dashboard?.stats} />

      <ConsultationList schedule={dashboard?.schedule || []} reviews={dashboard?.recent_reviews || []} />

      <EarningsBars trend={dashboard?.earning_trend || []} transactions={dashboard?.schedule || []} />
    </div>
  );
}
