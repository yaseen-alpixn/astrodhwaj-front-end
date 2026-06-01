"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  HeartHandshake,
  BriefcaseBusiness,
  Stethoscope,
  Sparkles,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { fetchTarotReading, type TarotCard, type TarotCategory } from "@/services/tarot.service";
import TarotCardFlip from "@/app/User/TarotReading/TarotCardFlip";
import TarotInterpretation from "@/app/User/TarotReading/TarotInterpretation";
import { tarotSteps } from "@/app/User/TarotReading/tarotData";

// ─── Category Config ─────────────────────────────────────────────────────────

type CategoryOption = {
  key: TarotCategory;
  label: string;
  description: string;
  Icon: React.ElementType;
  gradient: string;
  activeRing: string;
  src: string;
};

const CATEGORIES: CategoryOption[] = [
  {
    key: "love",
    label: "Love & Relationships",
    description: "Insights on your heart, bonds, and connections with others.",
    Icon: HeartHandshake,
    gradient: "bg-[linear-gradient(135deg,#c0392b_0%,#6b17d7_60%,#0D42AD_100%)]",
    activeRing: "ring-2 ring-[#c0392b]/60",
    src: "/images/Love.png",
  },
  {
    key: "career",
    label: "Career & Success",
    description: "Guidance on your work, goals, and path to growth.",
    Icon: BriefcaseBusiness,
    gradient: "bg-[linear-gradient(135deg,#0180D5_0%,#6b17d7_58%,#0040C1_100%)]",
    activeRing: "ring-2 ring-[#0D42AD]/60",
    src: "/images/Career.png",
  },
  {
    key: "health",
    label: "Health & Wellness",
    description: "What the cards say about your body, mind, and energy.",
    Icon: Stethoscope,
    gradient: "bg-[linear-gradient(135deg,#11998e_0%,#0D42AD_60%,#6b17d7_100%)]",
    activeRing: "ring-2 ring-[#11998e]/60",
    src: "/images/Health.png",
  },
];

// ─── Loading Oracle Ring ──────────────────────────────────────────────────────

function OracleLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-16">
      {/* Animated rings */}
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#6b17d7]"
          style={{ animationDuration: "1.2s" }}
        />
        <span
          className="absolute inset-[8px] animate-spin rounded-full border-2 border-transparent border-t-[#4898E1]"
          style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
        />
        <span
          className="absolute inset-[16px] animate-spin rounded-full border-2 border-transparent border-t-[#f4c500]"
          style={{ animationDuration: "2.4s" }}
        />
        <span className="text-[20px] text-[#6b17d7]">✦</span>
      </div>
      <div className="text-center">
        <p className="text-[15px] font-semibold text-[#18161e]">
          The oracle is reading your cards…
        </p>
        <p className="mt-1 text-[13px] text-[#6f6b77]">
          Hold your question in your heart
        </p>
      </div>
      {/* Animated dots */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="tarot-dot h-2 w-2 rounded-full bg-[#6b17d7]"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type AppState = "idle" | "loading" | "results" | "error";

export default function TarotReadingClient() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [selectedCategory, setSelectedCategory] = useState<TarotCategory>("career");
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const isFetching = useRef(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // ── Fetch Reading ──────────────────────────────────────────────────────────
  const startReading = useCallback(async () => {
    if (isFetching.current) return;
    isFetching.current = true;
    setAppState("loading");
    setCards([]);
    setInterpretation("");
    setErrorMsg("");

    try {
      const data = await fetchTarotReading(selectedCategory, 3, "three");

      if (!data.cards || data.cards.length === 0) {
        throw new Error("The oracle returned an empty reading. Please try again.");
      }

      setCards(data.cards);
      setInterpretation(data.interpretation ?? "");
      setAppState("results");

      // Scroll results into view
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setAppState("error");
    } finally {
      isFetching.current = false;
    }
  }, [selectedCategory]);

  // ── Reset ──────────────────────────────────────────────────────────────────
  const resetReading = useCallback(() => {
    setAppState("idle");
    setCards([]);
    setInterpretation("");
    setErrorMsg("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const isLoading = appState === "loading";
  const showResults = appState === "results";
  const showError = appState === "error";

  return (
    <main className="bg-[radial-gradient(circle_at_top,rgba(188,161,255,0.18),transparent_26%),linear-gradient(180deg,#ffffff_0%,#fcf8ff_100%)] px-4 pb-10 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <div className="mx-auto max-w-[1320px] space-y-8">

        {/* ── Page Header ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4c500] shadow-[0_4px_16px_rgba(244,197,0,0.35)]">
            <Sparkles className="h-6 w-6 text-white" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-[22px] font-bold tracking-[-0.04em] text-[#18161e]">
              Tarot Reading
            </h2>
            <p className="text-[13px] text-[#6f6b77]">
              Let the cards guide you — focus on your question
            </p>
          </div>
        </div>

        {/* ── Category Selector ─────────────────────────────────────────────── */}
        {!showResults && (
          <section aria-label="Choose a reading category" className="space-y-3">
            <h3 className="text-[15px] font-semibold text-[#18161e]">
              Your reading will cover three crucial domains of your life:
            </h3>

            <div className="flex flex-col gap-3 sm:flex-row">
              {CATEGORIES.map(({ key, label, description, Icon, gradient, src }) => {
                return (
                  <div
                    key={key}
                    className={`
                      flex flex-1 items-center gap-3 rounded-[18px] px-4 py-4 text-white text-left
                      transition-all duration-200
                      ${gradient}
                      shadow-[0_8px_30px_rgba(13,66,173,0.15)] hover:scale-[1.01]
                    `}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20">
                      <Image
                        src={src}
                        alt={label}
                        width={20}
                        height={20}
                        className="object-contain"
                        onError={() => {}}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold tracking-[-0.02em]">{label}</p>
                      <p className="mt-0.5 text-[12px] text-white/80 leading-tight">
                        {description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Get Reading Button ────────────────────────────────────────────── */}
        {(appState === "idle" || showError) && (
          <div className="flex flex-col items-center gap-3">
            <button
              id="tarot-draw-btn"
              type="button"
              onClick={startReading}
              className="group relative inline-flex min-h-[52px] min-w-[220px] items-center justify-center gap-2.5 overflow-hidden rounded-[14px] bg-[#0D42AD] px-8 text-[15px] font-semibold text-white shadow-[0_8px_30px_rgba(13,66,173,0.35)] transition-all duration-200 hover:bg-[#0a3390] hover:shadow-[0_12px_40px_rgba(13,66,173,0.45)] hover:translate-y-[-1px] active:scale-[0.98]"
            >
              {/* Button shimmer */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -skew-x-12 translate-x-[-110%] bg-white/10 transition-transform duration-700 group-hover:translate-x-[110%]"
              />
              <Sparkles className="h-5 w-5" strokeWidth={2} />
              <span>Reveal My Reading</span>
            </button>
            <p className="text-[12px] text-[#6f6b77]">
              Focus on your question and let intuition guide you
            </p>
          </div>
        )}

        {/* ── Loading State ─────────────────────────────────────────────────── */}
        {isLoading && <OracleLoader />}

        {/* ── Error State ───────────────────────────────────────────────────── */}
        {showError && (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-[18px] border border-red-200 bg-red-50 px-6 py-6 text-center"
          >
            <span className="text-3xl">☽</span>
            <p className="text-[15px] font-semibold text-red-700">
              The veil remains closed
            </p>
            <p className="text-[13px] text-red-600/80">{errorMsg}</p>
          </div>
        )}

        {/* ── Results Section ───────────────────────────────────────────────── */}
        {showResults && (
          <div ref={resultsRef} className="space-y-8">

            {/* Selected category badge */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F4FF] px-4 py-1.5">
                <Sparkles className="h-4 w-4 text-[#4898E1]" strokeWidth={2} />
                <span className="text-[13px] font-semibold text-[#0D42AD] capitalize">
                  Full Three-Domain Reading
                </span>
              </div>

              {/* Draw Again */}
              <button
                type="button"
                onClick={resetReading}
                className="inline-flex items-center gap-2 rounded-[10px] border border-[#e2d9f3] bg-white px-4 py-2 text-[13px] font-medium text-[#6b17d7] shadow-sm transition hover:bg-[#faf5ff] hover:shadow"
              >
                <RefreshCw className="h-4 w-4" strokeWidth={2} />
                Draw Again
              </button>
            </div>

            {/* Spread label */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8b4ff]/60 to-transparent" />
              <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6b17d7]">
                Your Three-Card Spread
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#c8b4ff]/60 to-transparent" />
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {cards.map((card, i) => (
                <TarotCardFlip
                  key={card.id}
                  card={card}
                  index={i}
                  revealed={true}
                />
              ))}
            </div>

            {/* AI Interpretation */}
            {interpretation && (
              <TarotInterpretation interpretation={interpretation} />
            )}

            {/* Bottom draw-again */}
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={resetReading}
                className="group inline-flex items-center gap-2.5 rounded-[14px] bg-gradient-to-r from-[#6b17d7] to-[#0D42AD] px-8 py-3.5 text-[14px] font-semibold text-white shadow-[0_8px_24px_rgba(107,23,215,0.30)] transition-all hover:shadow-[0_12px_32px_rgba(107,23,215,0.40)] hover:-translate-y-0.5"
              >
                <span className="text-[#f4c500]">✦</span>
                Start a New Reading
                <span className="text-[#f4c500]">✦</span>
              </button>
            </div>
          </div>
        )}

        {/* ── How It Works ──────────────────────────────────────────────────── */}
        {!showResults && (
          <section className="rounded-[20px] bg-gradient-to-r from-[#CCF7FF] to-[#E1E6FF] px-5 py-5 shadow-[0_18px_40px_rgba(111,76,170,0.08)] sm:px-6">
            <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-[#4898E1]">
              How It Works
            </h3>
            <ol className="mt-3 space-y-2.5 text-[13px] font-normal text-[#6f6473]">
              {tarotSteps.map((step, index) => (
                <li key={step} className="flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#4898E1]/20 text-[11px] font-bold text-[#0D42AD]">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

      </div>
    </main>
  );
}
