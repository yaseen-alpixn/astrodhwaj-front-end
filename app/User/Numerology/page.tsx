"use client";

import { useState } from "react";
import Image from "next/image";
import NumerologyFormCard from "@/app/User/Numerology/NumerologyFormCard";
import NumerologyGrid from "@/app/User/Numerology/NumerologyGrid";
import NumerologyInsights from "@/app/User/Numerology/NumerologyInsights";
import { calculateNumerology, type NumerologyResult } from "@/services/numerology.service";

// Empty initial industrial state
const EMPTY_GRID = [
  { id: 4, value: "4", detail: "", filled: false },
  { id: 9, value: "9", detail: "", filled: false },
  { id: 2, value: "2", detail: "", filled: false },
  { id: 3, value: "3", detail: "", filled: false },
  { id: 5, value: "5", detail: "", filled: false },
  { id: 7, value: "7", detail: "", filled: false },
  { id: 8, value: "8", detail: "", filled: false },
  { id: 1, value: "1", detail: "", filled: false },
  { id: 6, value: "6", detail: "", filled: false },
];

const EMPTY_METRICS = [
  { label: "Name Number", value: "-", src: "/images/Num1.png" },
  { label: "Soul Number", value: "-", src: "/images/Num2.png" },
  { label: "Personality Number", value: "-", src: "/images/Num3.png" },
  { label: "Destiny Number / Conductor Number", value: "-", src: "/images/NumStar.png" },
];

export default function NumerologyPage() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [result, setResult] = useState<NumerologyResult>({
    metrics: EMPTY_METRICS,
    grid: EMPTY_GRID,
    insights: [],
    name_breakdown: [],
    driver_number: undefined,
    conductor_number: undefined,
    life_path_number: undefined,
    destiny_number: undefined,
  });

  const handleCalculate = async () => {
    if (!fullName.trim() || !birthDate) {
      setError("Please enter your full name and date of birth.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await calculateNumerology(fullName, birthDate);
      setResult(data);
      setCalculated(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(193,170,255,0.18),transparent_28%),linear-gradient(180deg,#ffffff_0%,#fcf9ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-8">
        
        {/* Main Grid Section (Chaldean Vedic Numerology Layout) */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          
          {/* Column 1: Inputs, Lo Shu Grid, Static Conversion Chart */}
          <div className="space-y-6">
            <NumerologyFormCard
              birthDate={birthDate}
              error={error}
              fullName={fullName}
              loading={loading}
              onBirthDateChange={setBirthDate}
              onFullNameChange={setFullName}
              onSubmit={handleCalculate}
            />
            
            <NumerologyGrid grid={result.grid} />
            
            {/* Chaldean Look-up Conversion Chart */}
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6">
              <h3 className="text-[16px] font-bold text-[#18171d] mb-4">Numerology Number Chart</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-200 text-center text-[12px] font-semibold">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                      <th className="p-2 border-r border-slate-200">1</th>
                      <th className="p-2 border-r border-slate-200">2</th>
                      <th className="p-2 border-r border-slate-200">3</th>
                      <th className="p-2 border-r border-slate-200">4</th>
                      <th className="p-2 border-r border-slate-200">5</th>
                      <th className="p-2 border-r border-slate-200">6</th>
                      <th className="p-2 border-r border-slate-200">7</th>
                      <th className="p-2">8</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200">A</td>
                      <td className="p-2 border-r border-slate-200">B</td>
                      <td className="p-2 border-r border-slate-200">C</td>
                      <td className="p-2 border-r border-slate-200">D</td>
                      <td className="p-2 border-r border-slate-200">E</td>
                      <td className="p-2 border-r border-slate-200">U</td>
                      <td className="p-2 border-r border-slate-200">O</td>
                      <td className="p-2">F</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200">I</td>
                      <td className="p-2 border-r border-slate-200">K</td>
                      <td className="p-2 border-r border-slate-200">G</td>
                      <td className="p-2 border-r border-slate-200">M</td>
                      <td className="p-2 border-r border-slate-200">H</td>
                      <td className="p-2 border-r border-slate-200">V</td>
                      <td className="p-2 border-r border-slate-200">Z</td>
                      <td className="p-2">P</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200">J</td>
                      <td className="p-2 border-r border-slate-200">R</td>
                      <td className="p-2 border-r border-slate-200">L</td>
                      <td className="p-2 border-r border-slate-200">T</td>
                      <td className="p-2 border-r border-slate-200">N</td>
                      <td className="p-2 border-r border-slate-200">W</td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2"></td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200">Q</td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200">S</td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200">X</td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2"></td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-slate-200">Y</td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2 border-r border-slate-200"></td>
                      <td className="p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Column 2: Name Letters Breakdown table, Driver/Conductor Blocks */}
          <div className="space-y-6">
            
            {/* Letter-by-Letter Breakdown Table */}
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6 h-[395px] overflow-hidden flex flex-col">
              <h3 className="text-[16px] font-bold text-[#18171d] mb-4">Name Calculation</h3>
              <div className="overflow-y-auto flex-1 pr-1">
                {calculated && result.name_breakdown && result.name_breakdown.length > 0 ? (
                  <table className="w-full border-collapse text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                        <th className="py-2.5 pr-4">Letter</th>
                        <th className="py-2.5 px-4 text-center">Chaldean Value</th>
                        <th className="py-2.5 pl-4 text-right">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {result.name_breakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 pr-4 font-bold text-slate-800 text-[14px]">{item.letter}</td>
                          <td className="py-3 px-4 text-center font-extrabold text-[#0D42AD]">{item.value}</td>
                          <td className="py-3 pl-4 text-right">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.type === "Vowel"
                                  ? "bg-purple-50 text-purple-600"
                                  : "bg-amber-50 text-amber-600"
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-slate-400 text-[13px] py-12">
                    <span className="text-3xl mb-2">✍️</span>
                    <p className="font-semibold text-slate-500">Awaiting Name Input</p>
                    <p className="text-slate-400/80 text-[11px] text-center max-w-[180px] mt-0.5">
                      Enter your full name above to see the Chaldean letter-by-letter breakdown.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Life Path / Driver Box */}
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6">
              <h3 className="text-[15px] font-bold text-[#18171d] mb-4">Life Path Number / Driver Number</h3>
              <div className="flex items-center gap-8 justify-around bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Life Path</span>
                  <span className="text-[34px] font-black text-rose-500 leading-none">{calculated ? (result.life_path_number ?? "-") : "-"}</span>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div className="text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Driver</span>
                  <span className="text-[34px] font-black text-rose-500 leading-none">{calculated ? (result.driver_number ?? "-") : "-"}</span>
                </div>
              </div>
            </div>

            {/* Destiny / Conductor Box */}
            <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6">
              <h3 className="text-[15px] font-bold text-[#18171d] mb-4">Destiny Number / Conductor Number</h3>
              <div className="flex items-center gap-8 justify-around bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60">
                <div className="text-center w-full">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1 font-semibold text-slate-500">Destiny / Conductor</span>
                  <span className="text-[34px] font-black text-indigo-600 leading-none block mt-1.5">{calculated ? (result.conductor_number ?? "-") : "-"}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 3: Stacked Metric Cards (Name, Soul, Personality, Destiny) */}
          <div className="space-y-4 lg:py-1">
            <h3 className="text-[15px] font-bold text-[#18171d] mb-1 hidden lg:block">Chaldean Summary Metrics</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {result.metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="relative rounded-[22px] bg-gradient-to-r from-[#0180D5] via-[#4898E1] to-[#0D42AD] p-5 text-white shadow-[0_16px_36px_rgba(13,66,173,0.18)] flex items-center justify-between transition hover:scale-[1.01] hover:shadow-[0_20px_45px_rgba(13,66,173,0.25)] overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  
                  <div>
                    <span className="text-[11px] font-semibold text-white/80 uppercase tracking-widest block mb-1">{metric.label}</span>
                    <span className="text-[30px] font-black leading-none">{metric.value}</span>
                  </div>
                  {metric.src && (
                    <div className="relative h-12 w-12 opacity-85 shrink-0">
                      <Image
                        src={metric.src}
                        alt={metric.label}
                        fill
                        className="object-contain"
                        onError={() => {}}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
        </div>

        {/* Insights Section at the Bottom */}
        {calculated && result.insights && result.insights.length > 0 ? (
          <NumerologyInsights insights={result.insights} />
        ) : (
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-8 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6 text-center">
            <span className="text-4xl mb-3 block">📜</span>
            <h3 className="text-[16px] font-bold text-slate-700 mb-1">Your Numerology Profile</h3>
            <p className="text-slate-400 text-[13px] max-w-[380px] mx-auto leading-relaxed">
              Enter your full name and date of birth in the form above and click <strong>Calculate Number</strong> to generate your comprehensive Chaldean & Vedic Lo Shu profile.
            </p>
          </div>
        )}
        
      </div>
    </main>
  );
}
