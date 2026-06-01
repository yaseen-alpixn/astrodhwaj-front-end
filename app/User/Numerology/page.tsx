"use client";

import { useState } from "react";

import NumerologyFormCard from "@/app/User/Numerology/NumerologyFormCard";
import NumerologyGrid from "@/app/User/Numerology/NumerologyGrid";
import NumerologyInsights from "@/app/User/Numerology/NumerologyInsights";
import NumerologyMetricCards from "@/app/User/Numerology/NumerologyMetricCards";
import {
  numerologyGrid,
  numerologyInsights,
  numerologyMetrics,
} from "@/app/User/Numerology/numerologyData";
import { calculateNumerology, type NumerologyResult } from "@/services/numerology.service";

export default function NumerologyPage() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<NumerologyResult>({
    metrics: numerologyMetrics,
    grid: numerologyGrid,
    insights: numerologyInsights,
  });

  const handleCalculate = async () => {
    if (!fullName.trim() || !birthDate) {
      setError("Please enter your full name and date of birth.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      setResult(await calculateNumerology(fullName, birthDate));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(193,170,255,0.18),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fcf9ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-8">
        <NumerologyFormCard
          birthDate={birthDate}
          error={error}
          fullName={fullName}
          loading={loading}
          onBirthDateChange={setBirthDate}
          onFullNameChange={setFullName}
          onSubmit={handleCalculate}
        />
        <NumerologyMetricCards metrics={result.metrics} />
        <NumerologyGrid grid={result.grid} />
        <NumerologyInsights insights={result.insights} />
      </div>
    </main>
  );
}
