"use client";

import {
  AlertCircle,
  Calendar,
  Clock3,
  Download,
  Heart,
  MapPin,
  Navigation,
  Star,
  UserRound,
} from "lucide-react";
import { FormEvent, ReactNode, useMemo, useRef, useState } from "react";
import { api, getToken } from "@/services/api";
import KundaliChartArt from "./KundaliChartArt";

type Severity = "None" | "Low" | "Medium" | "High";
type BirthForm = {
  full_name: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  gender: string;
};
type Planet = {
  planet: string;
  house: number;
  sign: string;
  degree: number;
  nakshatra: string;
  pada: number;
  strength: number;
};
type Dasha = {
  level: string;
  planet: string;
  parent_planet?: string | null;
  start_date: string;
  end_date: string;
  is_current: boolean;
};
type Dosha = {
  name: string;
  severity: Severity;
  description: string;
  factors: string[];
};
type KundliReport = {
  id: string;
  user_details: BirthForm;
  ascendant: { sign: string; degree: number };
  chart: { lagna: Record<string, string[]>; chandra: Record<string, string[]> };
  planet_positions: Planet[];
  dasha: Dasha[];
  dosha: Dosha[];
  interpretations: Array<{ key: string; ai_summary?: string }>;
  remedies: {
    remedies?: Array<{ title: string; text: string }>;
    gemstones?: Array<{ gemstone: string; note: string }>;
    mantras?: Array<{ mantra: string }>;
  };
};
type MatchResult = {
  id: string;
  guna_milan: Array<{ name: string; score: number; maximum: number; match_percent: number }>;
  total_score: number;
  compatibility_percent: number;
  match_result: string;
  mangal_analysis: Dosha[];
};
type StoredKundliState = {
  form: BirthForm;
  maleForm: BirthForm;
  femaleForm: BirthForm;
  report: KundliReport | null;
  match: MatchResult | null;
};
type NominatimPlace = {
  lat: string;
  lon: string;
  display_name: string;
};

const emptyForm: BirthForm = {
  full_name: "",
  date_of_birth: "",
  time_of_birth: "",
  place_of_birth: "",
  gender: "",
};
const STORAGE_KEY = "astrodhwaj:kundli:current";
const tabs = ["Chart", "Planets", "Dasha", "Dosha"];
const severityTone: Record<Severity, { card: string; badge: string }> = {
  None: { card: "border-[#2fd458] bg-[#ebffef]", badge: "bg-[#16c33a] text-white" },
  Low: { card: "border-[#ffd657] bg-[#fff9df]", badge: "bg-[#f2c300] text-white" },
  Medium: { card: "border-[#ffd657] bg-[#fff9df]", badge: "bg-[#f2c300] text-white" },
  High: { card: "border-[#ff8d8d] bg-[#fff0f0]", badge: "bg-[#ff5b5b] text-white" },
};

function readStoredState(): StoredKundliState {
  const fallback = { form: emptyForm, maleForm: emptyForm, femaleForm: emptyForm, report: null, match: null };
  if (typeof window === "undefined") return fallback;
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
  } catch {
    return fallback;
  }
}

function saveStoredState(nextState: StoredKundliState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function downloadBase64Pdf(filename: string, base64: string) {
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = filename;
  link.click();
}

export default function KundaliSections() {
  const initial = useMemo(readStoredState, []);
  const [form, setFormState] = useState<BirthForm>(initial.form);
  const [maleForm, setMaleFormState] = useState<BirthForm>(initial.maleForm);
  const [femaleForm, setFemaleFormState] = useState<BirthForm>(initial.femaleForm);
  const [report, setReportState] = useState<KundliReport | null>(initial.report);
  const [match, setMatchState] = useState<MatchResult | null>(initial.match);
  const [activeTab, setActiveTab] = useState("Chart");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [matchError, setMatchError] = useState("");
  const storedRef = useRef<StoredKundliState>(initial);

  const currentDashas = useMemo(
    () => report?.dasha.filter((item) => item.is_current).slice(0, 4) || [],
    [report],
  );

  function persist(next: Partial<StoredKundliState>) {
    storedRef.current = { ...storedRef.current, ...next };
    saveStoredState(storedRef.current);
  }

  function setForm(next: BirthForm) {
    setFormState(next);
    persist({ form: next });
  }

  function setMaleForm(next: BirthForm) {
    setMaleFormState(next);
    persist({ maleForm: next });
  }

  function setFemaleForm(next: BirthForm) {
    setFemaleFormState(next);
    persist({ femaleForm: next });
  }

  function setReport(next: KundliReport | null) {
    setReportState(next);
    persist({ report: next });
  }

  function setMatch(next: MatchResult | null) {
    setMatchState(next);
    persist({ match: next });
  }

  function newKundli() {
    const cleared = { form: emptyForm, maleForm: emptyForm, femaleForm: emptyForm, report: null, match: null };
    storedRef.current = cleared;
    localStorage.removeItem(STORAGE_KEY);
    setFormState(emptyForm);
    setMaleFormState(emptyForm);
    setFemaleFormState(emptyForm);
    setReportState(null);
    setMatchState(null);
    setActiveTab("Chart");
    setError("");
    setMatchError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading("generate");
    try {
      const response = await api<KundliReport>("/kundli/generate", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setReport(response.data);
      setMatch(null);
      setActiveTab("Chart");
      requestAnimationFrame(() => scrollToSection("kundli-chart"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate kundli");
    } finally {
      setLoading("");
    }
  }

  async function runMatch(event: FormEvent) {
    event.preventDefault();
    setMatchError("");
    setLoading("match");
    try {
      const body = {
        male: { birth_details: maleForm },
        female: { birth_details: femaleForm },
      };
      const response = await api<MatchResult>("/kundli/match", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setMatch(response.data);
      requestAnimationFrame(() => scrollToSection("kundli-matching-result"));
    } catch (err) {
      setMatchError(err instanceof Error ? err.message : "Unable to generate matching report");
    } finally {
      setLoading("");
    }
  }

  async function downloadPdf() {
    if (!report) {
      setError("Generate a Kundli first, then download the PDF.");
      return;
    }
    setError("");
    setLoading("pdf");
    try {
      const response = await api<{ filename: string; pdf_base64: string }>("/kundli/pdf", {
        method: "POST",
        body: JSON.stringify({ report_id: report.id, matching: match }),
      });
      downloadBase64Pdf(response.data.filename, response.data.pdf_base64);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to download PDF");
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="space-y-4 bg-[#fcfbff] px-4 pb-8 pt-5 sm:px-5 lg:px-7">
      <form
        onSubmit={generate}
        className="rounded-[18px] border border-[#e7dff2] bg-white p-4 shadow-[0_10px_24px_rgba(32,17,56,0.04)] sm:p-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-[#171717]">Enter Your Birth Details</h2>
          {report ? (
            <button
              type="button"
              onClick={newKundli}
              className="rounded-[8px] border border-[#4898E1] px-4 py-2 text-[12px] font-medium text-[#0D42AD]"
            >
              New Kundli
            </button>
          ) : null}
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field
            icon={<UserRound className="h-4 w-4 text-[#7c7589]" />}
            label="Full Name"
            value={form.full_name}
            onChange={(value) => setForm({ ...form, full_name: value })}
            placeholder="Enter your full name"
          />
          <Field
            icon={<Calendar className="h-4 w-4 text-[#7c7589]" />}
            label="Date of Birth"
            type="date"
            value={form.date_of_birth}
            onChange={(value) => setForm({ ...form, date_of_birth: value })}
          />
          <Field
            icon={<Clock3 className="h-4 w-4 text-[#7c7589]" />}
            label="Time of Birth"
            type="time"
            value={form.time_of_birth}
            onChange={(value) => setForm({ ...form, time_of_birth: value })}
          />
          <LocationField
            label="Place of Birth"
            value={form.place_of_birth}
            onChange={(value) => setForm({ ...form, place_of_birth: value })}
          />
        </div>
        <label className="mt-4 block max-w-full sm:max-w-[244px]">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">Gender</span>
          <select
            required
            value={form.gender}
            onChange={(event) => setForm({ ...form, gender: event.target.value })}
            className="h-11 w-full rounded-[8px] border border-[#cfc8da] bg-white px-3 text-sm text-[#32283f] outline-none"
          >
            <option value="">Add gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <button className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white shadow-sm transition active:scale-[0.98]">
          <Star className="h-4 w-4" />
          {loading === "generate" ? "Generating..." : "Generate Kundli"}
        </button>
        {error ? <ErrorBox title="Kundli Error" text={error} /> : null}
      </form>

      {!report ? (
        <MatchingSection
          maleForm={maleForm}
          femaleForm={femaleForm}
          setMaleForm={setMaleForm}
          setFemaleForm={setFemaleForm}
          onSubmit={runMatch}
          loading={loading}
          match={match}
          error={matchError}
        />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-2 rounded-[14px] border border-[#e7dff2] bg-white p-2 shadow-[0_10px_24px_rgba(32,17,56,0.04)] sm:grid-cols-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  scrollToSection(`kundli-${tab.toLowerCase()}`);
                }}
                className={
                  activeTab === tab
                    ? "rounded-[6px] bg-[#4898E1] px-4 py-2 text-[13px] font-medium text-white"
                    : "rounded-[6px] bg-[#f4f4f4] px-4 py-2 text-[13px] font-medium text-[#222]"
                }
              >
                {tab}
              </button>
            ))}
          </section>

          <ChartSection report={report} />
          <DashaSection dashas={report.dasha} currentDashas={currentDashas} />
          <DoshaSection doshas={report.dosha} report={report} />
          <PlanetSection planets={report.planet_positions} />
          <MatchingSection
            maleForm={maleForm}
            femaleForm={femaleForm}
            setMaleForm={setMaleForm}
            setFemaleForm={setFemaleForm}
            onSubmit={runMatch}
            loading={loading}
            match={match}
            error={matchError}
          />
          <PdfSection onPdf={downloadPdf} loading={loading} />
        </>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-[#222]">{label}</span>
      <div className="flex h-11 items-center gap-2 rounded-[8px] border border-[#cfc8da] bg-white px-3 text-sm text-[#7c7589]">
        {icon}
        <input
          required
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onClick={(event) => {
            if (type === "date" || type === "time") {
              event.currentTarget.showPicker?.();
            }
          }}
          className="w-full bg-transparent text-[#32283f] outline-none"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}

function LocationField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (formattedValue: string) => void;
}) {
  const [suggestions, setSuggestions] = useState<NominatimPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayValue = readablePlace(value);

  function handleSearch(query: string) {
    onChange(query);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`,
          { headers: { "Accept-Language": "en" } },
        );
        const data = (await response.json()) as NominatimPlace[];
        setSuggestions(data || []);
        setShowDropdown(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 450);
  }

  function selectPlace(item: NominatimPlace) {
    const formatted = `${item.lat}, ${item.lon}, ${item.display_name}`;
    onChange(formatted);
    setSuggestions([]);
    setShowDropdown(false);
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      window.alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`,
          );
          const data = (await response.json()) as { display_name?: string };
          const name = data.display_name || `${latitude}, ${longitude}`;
          onChange(`${latitude}, ${longitude}, ${name}`);
        } catch {
          onChange(`${latitude}, ${longitude}`);
        } finally {
          setDetecting(false);
          setShowDropdown(false);
        }
      },
      (geoError) => {
        setDetecting(false);
        window.alert(`Geolocation error: ${geoError.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return (
    <div className="relative block">
      <span className="mb-1.5 block text-[14px] font-medium text-[#222]">{label}</span>
      <div className="flex h-11 items-center gap-2 rounded-[8px] border border-[#cfc8da] bg-white px-3 text-sm text-[#7c7589]">
        <MapPin className="h-4 w-4 shrink-0 text-[#7c7589]" />
        <input
          required
          type="text"
          value={displayValue}
          onChange={(event) => handleSearch(event.target.value)}
          onFocus={() => setShowDropdown(suggestions.length > 0)}
          className="w-full bg-transparent text-[#32283f] outline-none"
          placeholder="City, State, Country"
        />
        {loading || detecting ? (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#cfc8da] border-t-[#4898E1]" />
        ) : (
          <button
            type="button"
            onClick={detectLocation}
            title="Detect current location"
            className="flex shrink-0 items-center justify-center rounded-full p-1.5 hover:bg-slate-100"
          >
            <Navigation className="h-3.5 w-3.5 text-[#4898E1]" />
          </button>
        )}
      </div>
      {showDropdown && suggestions.length > 0 ? (
        <ul className="absolute left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-[8px] border border-[#e7dff2] bg-white py-1 text-[13px] text-slate-700 shadow-lg">
          {suggestions.map((item) => (
            <li
              key={`${item.lat}-${item.lon}-${item.display_name}`}
              onClick={() => selectPlace(item)}
              className="cursor-pointer px-4 py-2 text-left transition hover:bg-[#E8F4FF] hover:text-[#0D42AD]"
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function readablePlace(value: string) {
  const parts = value.split(",");
  if (parts.length >= 3 && !Number.isNaN(Number(parts[0])) && !Number.isNaN(Number(parts[1]))) {
    return parts.slice(2).join(",").trim();
  }
  return value;
}

function ChartSection({ report }: { report: KundliReport }) {
  return (
    <section id="kundli-chart" className="space-y-4 scroll-mt-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
          <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">Lagna Chart (Birth Chart)</h3>
          <KundaliChartArt variant="lagna" houses={report.chart.lagna} />
          <div className="mt-3 rounded-[10px] bg-[#fff2f2] px-3 py-2 text-[12px] leading-relaxed text-[#6a5362]">
            <span className="text-[11px] font-medium text-[#ff3f3f]">Legend:</span> Asc = Ascendant, Sun, Moon, Mars,
            Mercury, Jupiter, Venus, Saturn, Rahu, Ketu.
          </div>
        </article>
        <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
          <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">Chandra Kundali (Moon Chart)</h3>
          <KundaliChartArt variant="chandra" houses={report.chart.chandra} />
        </article>
      </div>
      <ActionButtons />
    </section>
  );
}

function DashaSection({
  dashas,
  currentDashas,
}: {
  dashas: Dasha[];
  currentDashas: Dasha[];
}) {
  const visible = dashas.filter((item) => item.level === "mahadasha" || item.is_current).slice(0, 8);
  return (
    <section id="kundli-dasha" className="space-y-3 scroll-mt-5">
      <h2 className="font-medium">Vimshottari Dasha Periods</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {visible.map((dasha, index) => (
          <article
            key={`${dasha.level}-${dasha.planet}-${index}`}
            className={
              dasha.is_current
                ? "rounded-[14px] border border-[#e7dff2] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
                : "rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
            }
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  {dasha.parent_planet ? `${dasha.parent_planet} - ${dasha.planet}` : dasha.planet} {dasha.level}
                </h3>
                <p className="mt-1 text-[12px] text-[#61576b]">
                  {dasha.start_date} - {dasha.end_date}
                </p>
              </div>
              {dasha.is_current ? (
                <span className="rounded-full bg-[#4898E1] px-3 py-1 text-[11px] font-medium text-white">Current</span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {currentDashas.length ? (
        <div className="rounded-[8px] bg-[#fff8d8] px-3 py-3 text-[13px] leading-[22px] text-[#4a4038]">
          <b>Current Period:</b>{" "}
          {currentDashas.map((item) => (item.parent_planet ? `${item.parent_planet}-${item.planet}` : item.planet)).join(", ")}
        </div>
      ) : null}
    </section>
  );
}

function DoshaSection({
  doshas,
  report,
}: {
  doshas: Dosha[];
  report: KundliReport;
}) {
  return (
    <section id="kundli-dosha" className="space-y-4 scroll-mt-5">
      <h2 className="font-medium">Dosha Analysis</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {doshas.map((item) => {
          const tone = severityTone[item.severity];
          return (
            <article key={item.name} className={`rounded-[14px] border p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)] ${tone.card}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">{item.name}</h3>
                  <p className="mt-1 text-[12px] text-[#61576b]">{item.description}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-[11px] font-medium ${tone.badge}`}>{item.severity}</span>
              </div>
            </article>
          );
        })}
      </div>
      <RemediesPanel report={report} />
    </section>
  );
}

function PlanetSection({ planets }: { planets: Planet[] }) {
  return (
    <section id="kundli-planets" className="space-y-4 scroll-mt-5">
      <h2 className="font-medium">Planetary Positions</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {planets.map((planet) => (
          <article
            key={planet.planet}
            className="rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
          >
            <h3 className="text-[16px] font-semibold text-[#171717]">{planet.planet}</h3>
            <p className="mt-1 text-[12px] text-[#7a7286]">
              {planet.sign} - {planet.house}th House - {planet.degree.toFixed(2)} deg - {planet.nakshatra} Pada {planet.pada}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#0085FF_0%,#DD9A29_100%)]"
                  style={{ width: `${planet.strength}%` }}
                />
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#8a8095]">Strength</p>
                <p className="text-[14px] font-medium text-[#4898E1]">{planet.strength}%</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function MatchingSection({
  maleForm,
  femaleForm,
  setMaleForm,
  setFemaleForm,
  onSubmit,
  loading,
  match,
  error,
}: {
  maleForm: BirthForm;
  femaleForm: BirthForm;
  setMaleForm: (form: BirthForm) => void;
  setFemaleForm: (form: BirthForm) => void;
  onSubmit: (event: FormEvent) => void;
  loading: string;
  match: MatchResult | null;
  error: string;
}) {
  return (
    <section id="kundli-matching" className="space-y-4 scroll-mt-5">
      <h2 className="font-medium">Kundli Matching</h2>
      <form
        onSubmit={onSubmit}
        className="grid gap-4 rounded-[18px] border border-[#e7dff2] bg-white p-4 shadow-[0_10px_24px_rgba(32,17,56,0.04)] lg:grid-cols-2"
      >
        <MatchPerson title="Male Kundli" form={maleForm} setForm={setMaleForm} />
        <MatchPerson title="Female Kundli" form={femaleForm} setForm={setFemaleForm} />
        {error ? (
          <div className="lg:col-span-2">
            <ErrorBox title="Matching Error" text={error} />
          </div>
        ) : null}
        <button className="rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white shadow-sm lg:col-span-2">
          {loading === "match" ? "Matching..." : "Generate Kundli Matching"}
        </button>
      </form>
      {match ? <CompatibilityResult match={match} /> : null}
    </section>
  );
}

function MatchPerson({ title, form, setForm }: { title: string; form: BirthForm; setForm: (form: BirthForm) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="text-left font-medium">{title}</h3>
      <Field
        icon={<UserRound className="h-4 w-4 text-[#7c7589]" />}
        label="Full Name"
        value={form.full_name}
        onChange={(value) => setForm({ ...form, full_name: value })}
      />
      <Field
        icon={<Calendar className="h-4 w-4 text-[#7c7589]" />}
        label="Date of Birth"
        type="date"
        value={form.date_of_birth}
        onChange={(value) => setForm({ ...form, date_of_birth: value })}
      />
      <Field
        icon={<Clock3 className="h-4 w-4 text-[#7c7589]" />}
        label="Time of Birth"
        type="time"
        value={form.time_of_birth}
        onChange={(value) => setForm({ ...form, time_of_birth: value })}
      />
      <LocationField
        label="Place of Birth"
        value={form.place_of_birth}
        onChange={(value) => setForm({ ...form, place_of_birth: value })}
      />
      <select
        required
        value={form.gender}
        onChange={(event) => setForm({ ...form, gender: event.target.value })}
        className="h-11 w-full rounded-[8px] border border-[#cfc8da] bg-white px-3 text-sm text-[#32283f] outline-none"
      >
        <option value="">Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
    </div>
  );
}

function CompatibilityResult({ match }: { match: MatchResult }) {
  return (
    <section id="kundli-matching-result" className="space-y-4 scroll-mt-5">
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#0085FF_0%,#DD9A29_100%)] px-4 py-6 text-center text-white shadow-[0_18px_36px_rgba(158,17,109,0.22)]">
        <Heart className="mx-auto h-10 w-10" />
        <p className="mt-2 text-[13px]">Overall Compatibility</p>
        <p className="text-[20px] font-bold leading-none">{match.compatibility_percent}%</p>
        <p className="mt-1 text-[13px]">{match.match_result}</p>
        <p className="mt-1 text-[12px] text-[#ffd85a]">Guna Score: {match.total_score}/36</p>
      </div>
      <h2 className="font-medium">Ashtakoot Guna Milan (36 Points)</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {match.guna_milan.map((item) => (
          <article key={item.name} className="rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
            <h3 className="text-[16px] font-semibold">{item.name}</h3>
            <p className="mt-1 text-[12px] text-[#7a7286]">
              Score: {item.score}/{item.maximum}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]">
                <div className="h-full rounded-full bg-[#16c33a]" style={{ width: `${item.match_percent}%` }} />
              </div>
              <p className="text-[14px] font-medium text-[#7b16c5]">{item.match_percent}%</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RemediesPanel({ report }: { report: KundliReport }) {
  const remedies = report.remedies.remedies || [];
  const mantras = report.remedies.mantras || [];
  const gemstones = report.remedies.gemstones || [];
  return (
    <div className="rounded-[8px] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] px-3 py-3">
      <h3 className="text-[14px] font-medium text-[#4898E1]">Remedies Suggested</h3>
      <ul className="mt-2 space-y-1 text-[13px] text-[#61576b]">
        {remedies.map((item) => (
          <li key={item.title}>* {item.title}: {item.text}</li>
        ))}
        {mantras.map((item) => (
          <li key={item.mantra}>* Mantra: {item.mantra}</li>
        ))}
        {gemstones.map((item) => (
          <li key={item.gemstone}>* Gemstone: {item.gemstone} - {item.note}</li>
        ))}
      </ul>
    </div>
  );
}

function PdfSection({ onPdf, loading }: { onPdf: () => void; loading: string }) {
  return (
    <section id="kundli-pdf" className="rounded-[18px] border border-[#e7dff2] bg-white p-5 scroll-mt-5">
      <button
        onClick={onPdf}
        className="inline-flex items-center gap-2 rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white"
      >
        <Download className="h-4 w-4" />
        {loading === "pdf" ? "Preparing PDF..." : "Download Full Kundli PDF"}
      </button>
    </section>
  );
}

function ActionButtons() {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => scrollToSection("kundli-matching")}
        className="rounded-[8px] bg-[#4898E1] px-5 py-3 text-[13px] font-medium text-white transition hover:bg-[#4898E1]/90 shadow-sm active:scale-[0.98]"
      >
        Get Kundli Matching
      </button>
    </div>
  );
}

function ErrorBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-4 flex items-start gap-2.5 rounded-[8px] border border-red-200 bg-[#fff0f0] px-3.5 py-3 text-[13px] text-[#b42318] shadow-sm">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 leading-relaxed opacity-90">{text}</p>
      </div>
    </div>
  );
}
