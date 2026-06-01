"use client";

import { Calendar, Clock3, Download, Heart, MapPin, Star, UserRound } from "lucide-react";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import { api } from "@/services/api";
import KundaliChartArt from "./KundaliChartArt";

type Planet = { planet: string; house: number; sign: string; degree: number; nakshatra: string; pada: number; strength: number };
type Dasha = { level: string; planet: string; parent_planet?: string | null; start_date: string; end_date: string; is_current: boolean };
type Dosha = { name: string; severity: "None" | "Low" | "Medium" | "High"; description: string; factors: string[] };
type KundliReport = {
  id: string;
  user_details: { full_name: string; date_of_birth: string; time_of_birth: string; place_of_birth: string; gender: string };
  ascendant: { sign: string; degree: number };
  chart: { lagna: Record<string, string[]>; chandra: Record<string, string[]> };
  planet_positions: Planet[];
  dasha: Dasha[];
  dosha: Dosha[];
  interpretations: Array<{ key: string; ai_summary?: string; recommended_remedies?: string[] }>;
  remedies: { remedies?: Array<{ title: string; text: string }>; gemstones?: Array<{ gemstone: string; note: string }>; mantras?: Array<{ mantra: string }> };
};
type MatchResult = { id: string; guna_milan: Array<{ name: string; score: number; maximum: number; match_percent: number }>; total_score: number; compatibility_percent: number; match_result: string; mangal_analysis: Dosha[] };

const emptyForm = { full_name: "", date_of_birth: "", time_of_birth: "", place_of_birth: "", gender: "" };
const tabs = ["Chart", "Planets", "Dasha", "Dosha", "Remedies", "Matching", "PDF"];
const severityTone: Record<string, string> = {
  None: "border-[#2fd458] bg-[#ebffef]",
  Low: "border-[#ffd657] bg-[#fff9df]",
  Medium: "border-[#ffd657] bg-[#fff9df]",
  High: "border-[#ff8d8d] bg-[#fff0f0]",
};

function downloadBase64Pdf(filename: string, base64: string) {
  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${base64}`;
  link.download = filename;
  link.click();
}

export default function KundaliSections() {
  const [form, setForm] = useState(emptyForm);
  const [maleForm, setMaleForm] = useState(emptyForm);
  const [femaleForm, setFemaleForm] = useState(emptyForm);
  const [report, setReport] = useState<KundliReport | null>(null);
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [activeTab, setActiveTab] = useState("Chart");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const currentDashas = useMemo(() => report?.dasha.filter((item) => item.is_current).slice(0, 4) || [], [report]);

  async function generate(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading("generate");
    try {
      const response = await api<KundliReport>("/kundli/generate", { method: "POST", body: JSON.stringify(form) });
      setReport(response.data);
      setActiveTab("Chart");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate kundli");
    } finally {
      setLoading("");
    }
  }

  async function runMatch(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading("match");
    try {
      const body = { male: { birth_details: maleForm }, female: { birth_details: femaleForm } };
      const response = await api<MatchResult>("/kundli/match", { method: "POST", body: JSON.stringify(body) });
      setMatch(response.data);
      setActiveTab("Matching");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate matching report");
    } finally {
      setLoading("");
    }
  }

  async function downloadPdf() {
    if (!report) return;
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
      <form onSubmit={generate} className="rounded-[18px] border border-[#e7dff2] bg-white p-4 shadow-[0_10px_24px_rgba(32,17,56,0.04)] sm:p-5">
        <h2 className="text-[18px] font-semibold text-[#171717]">Enter Your Birth Details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field icon={<UserRound className="h-4 w-4" />} label="Full Name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} placeholder="Enter your full name" />
          <Field icon={<Calendar className="h-4 w-4" />} label="Date of Birth" type="date" value={form.date_of_birth} onChange={(value) => setForm({ ...form, date_of_birth: value })} />
          <Field icon={<Clock3 className="h-4 w-4" />} label="Time of Birth" type="time" value={form.time_of_birth} onChange={(value) => setForm({ ...form, time_of_birth: value })} />
          <Field icon={<MapPin className="h-4 w-4" />} label="Place of Birth" value={form.place_of_birth} onChange={(value) => setForm({ ...form, place_of_birth: value })} placeholder="City, State, Country or lat,lng,tz" />
        </div>
        <label className="mt-4 block max-w-full sm:max-w-[244px]">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">Gender</span>
          <select required value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="h-11 w-full rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#32283f] outline-none">
            <option value="">Add gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </label>
        <button className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white">
          <Star className="h-4 w-4" />
          {loading === "generate" ? "Generating..." : "Generate Kundli"}
        </button>
        {error ? <p className="mt-3 rounded-[8px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#b42318]">{error}</p> : null}
      </form>

      <section className="grid grid-cols-2 gap-2 rounded-[14px] border border-[#e7dff2] bg-white p-2 shadow-[0_10px_24px_rgba(32,17,56,0.04)] md:grid-cols-7">
        {tabs.map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "rounded-[6px] bg-[#4898E1] px-4 py-2 text-[13px] font-medium text-white" : "rounded-[6px] bg-[#f4f4f4] px-4 py-2 text-[13px] font-medium text-[#222]"}>
            {tab}
          </button>
        ))}
      </section>

      {!report ? (
        <section className="rounded-[18px] border border-[#e7dff2] bg-white p-5 text-[14px] text-[#61576b]">Generate a Kundli to view dynamic charts, planetary positions, dashas, doshas, remedies, matching, and PDF download.</section>
      ) : (
        <>
          {activeTab === "Chart" ? <ChartTab report={report} onPdf={downloadPdf} loading={loading} /> : null}
          {activeTab === "Planets" ? <PlanetsTab planets={report.planet_positions} /> : null}
          {activeTab === "Dasha" ? <DashaTab dashas={report.dasha} currentDashas={currentDashas} /> : null}
          {activeTab === "Dosha" ? <DoshaTab doshas={report.dosha} /> : null}
          {activeTab === "Remedies" ? <RemediesTab report={report} /> : null}
          {activeTab === "PDF" ? <PdfTab onPdf={downloadPdf} loading={loading} /> : null}
        </>
      )}

      {activeTab === "Matching" ? <MatchingTab maleForm={maleForm} femaleForm={femaleForm} setMaleForm={setMaleForm} setFemaleForm={setFemaleForm} onSubmit={runMatch} loading={loading} match={match} /> : null}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", icon }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; icon: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[14px] font-medium text-[#222]">{label}</span>
      <div className="flex h-11 items-center rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#7c7589]">
        <input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full bg-transparent text-[#32283f] outline-none" placeholder={placeholder} />
        {icon}
      </div>
    </label>
  );
}

function ChartTab({ report, onPdf, loading }: { report: KundliReport; onPdf: () => void; loading: string }) {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
          <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">Lagna Chart (Birth Chart)</h3>
          <KundaliChartArt variant="lagna" houses={report.chart.lagna} />
        </article>
        <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
          <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">Chandra Kundli (Moon Chart)</h3>
          <KundaliChartArt variant="chandra" houses={report.chart.chandra} />
        </article>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })} className="rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white">Get Kundli Matching</button>
        <button onClick={() => (window.location.href = "/User/Astrologers")} className="rounded-[8px] border border-[#4898E1] px-4 py-3 text-[12px] font-medium">Consult Expert</button>
        <button onClick={onPdf} className="rounded-[8px] border border-[#4898E1] px-4 py-3 text-[12px] font-medium">{loading === "pdf" ? "Preparing..." : "Download"}</button>
      </div>
    </section>
  );
}

function PlanetsTab({ planets }: { planets: Planet[] }) {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Planetary Positions</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {planets.map((planet) => (
          <article key={planet.planet} className="rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
            <h3 className="text-[16px] font-semibold text-[#171717]">{planet.planet}</h3>
            <p className="mt-1 text-[12px] text-[#7a7286]">{planet.sign} - House {planet.house} - {planet.degree.toFixed(2)} deg - {planet.nakshatra} Pada {planet.pada}</p>
            <div className="mt-4 flex items-end gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]"><div className="h-full rounded-full bg-[linear-gradient(90deg,#0085FF_0%,#DD9A29_100%)]" style={{ width: `${planet.strength}%` }} /></div>
              <div className="text-right"><p className="text-[11px] text-[#8a8095]">Strength</p><p className="text-[14px] font-medium text-[#4898E1]">{planet.strength}%</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashaTab({ dashas, currentDashas }: { dashas: Dasha[]; currentDashas: Dasha[] }) {
  return (
    <section className="space-y-3">
      <h2 className="font-medium">Vimshottari Dasha Periods</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {dashas.filter((item) => item.level === "mahadasha" || item.is_current).slice(0, 18).map((dasha, index) => (
          <article key={`${dasha.level}-${dasha.planet}-${index}`} className={dasha.is_current ? "rounded-[14px] border border-[#e7dff2] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] p-3" : "rounded-[14px] border border-[#e7dff2] bg-white p-3"}>
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-[16px] font-semibold text-[#171717]">{dasha.parent_planet ? `${dasha.parent_planet} - ${dasha.planet}` : dasha.planet} {dasha.level}</h3><p className="mt-1 text-[12px] text-[#61576b]">{dasha.start_date} - {dasha.end_date}</p></div>
              {dasha.is_current ? <span className="rounded-full bg-[#4898E1] px-3 py-1 text-[11px] font-medium text-white">Current</span> : null}
            </div>
          </article>
        ))}
      </div>
      {currentDashas.length ? <div className="rounded-[8px] bg-[#fff8d8] px-3 py-3 text-[13px] text-[#4a4038]"><b>Current Period:</b> {currentDashas.map((item) => item.parent_planet ? `${item.parent_planet}-${item.planet}` : item.planet).join(", ")}</div> : null}
    </section>
  );
}

function DoshaTab({ doshas }: { doshas: Dosha[] }) {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Dosha Analysis</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {doshas.map((item) => (
          <article key={item.name} className={`rounded-[14px] border p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)] ${severityTone[item.severity]}`}>
            <div className="flex items-start justify-between gap-3"><div><h3 className="text-[16px] font-semibold text-[#171717]">{item.name}</h3><p className="mt-1 text-[12px] text-[#61576b]">{item.description}</p></div><span className="rounded-full bg-[#16c33a] px-3 py-1 text-[11px] font-medium text-white">{item.severity}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function RemediesTab({ report }: { report: KundliReport }) {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Remedies and Interpretations</h2>
      <div className="rounded-[8px] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] px-3 py-3">
        <h3 className="text-[14px] font-medium text-[#4898E1]">Remedies Suggested</h3>
        <ul className="mt-2 space-y-1 text-[13px] text-[#61576b]">{report.remedies.remedies?.map((item) => <li key={item.title}>* {item.title}: {item.text}</li>)}</ul>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {report.interpretations.map((item) => <article key={item.key} className="rounded-[14px] border border-[#e7dff2] bg-white p-3"><p className="text-[13px] text-[#61576b]">{item.ai_summary}</p></article>)}
      </div>
    </section>
  );
}

function MatchingTab({ maleForm, femaleForm, setMaleForm, setFemaleForm, onSubmit, loading, match }: { maleForm: typeof emptyForm; femaleForm: typeof emptyForm; setMaleForm: (form: typeof emptyForm) => void; setFemaleForm: (form: typeof emptyForm) => void; onSubmit: (event: FormEvent) => void; loading: string; match: MatchResult | null }) {
  return (
    <section className="space-y-4">
      <form onSubmit={onSubmit} className="grid gap-4 rounded-[18px] border border-[#e7dff2] bg-white p-4 lg:grid-cols-2">
        <MatchPerson title="Male Kundli" form={maleForm} setForm={setMaleForm} />
        <MatchPerson title="Female Kundli" form={femaleForm} setForm={setFemaleForm} />
        <button className="rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white lg:col-span-2">{loading === "match" ? "Matching..." : "Generate Kundli Matching"}</button>
      </form>
      {match ? <CompatibilityResult match={match} /> : null}
    </section>
  );
}

function MatchPerson({ title, form, setForm }: { title: string; form: typeof emptyForm; setForm: (form: typeof emptyForm) => void }) {
  return (
    <div className="space-y-3">
      <h3 className="font-medium">{title}</h3>
      <Field icon={<UserRound className="h-4 w-4" />} label="Full Name" value={form.full_name} onChange={(value) => setForm({ ...form, full_name: value })} />
      <Field icon={<Calendar className="h-4 w-4" />} label="Date of Birth" type="date" value={form.date_of_birth} onChange={(value) => setForm({ ...form, date_of_birth: value })} />
      <Field icon={<Clock3 className="h-4 w-4" />} label="Time of Birth" type="time" value={form.time_of_birth} onChange={(value) => setForm({ ...form, time_of_birth: value })} />
      <Field icon={<MapPin className="h-4 w-4" />} label="Place of Birth" value={form.place_of_birth} onChange={(value) => setForm({ ...form, place_of_birth: value })} />
      <select required value={form.gender} onChange={(event) => setForm({ ...form, gender: event.target.value })} className="h-11 w-full rounded-[8px] border border-[#cfc8da] px-3 text-sm"><option value="">Gender</option><option>Male</option><option>Female</option><option>Other</option></select>
    </div>
  );
}

function CompatibilityResult({ match }: { match: MatchResult }) {
  return (
    <section className="space-y-4">
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#0085FF_0%,#DD9A29_100%)] px-4 py-6 text-center text-white"><Heart className="mx-auto h-10 w-10" /><p className="mt-2 text-[13px]">Overall Compatibility</p><p className="text-[20px] font-bold leading-none">{match.compatibility_percent}%</p><p className="mt-1 text-[13px]">{match.match_result}</p><p className="mt-1 text-[12px] text-[#ffd85a]">Guna Score: {match.total_score}/36</p></div>
      <div className="grid gap-3 lg:grid-cols-2">{match.guna_milan.map((item) => <article key={item.name} className="rounded-[14px] border border-[#e7dff2] bg-white p-3"><h3 className="text-[16px] font-semibold">{item.name}</h3><p className="mt-1 text-[12px] text-[#7a7286]">Score: {item.score}/{item.maximum}</p><div className="mt-4 flex items-end gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]"><div className="h-full rounded-full bg-[#16c33a]" style={{ width: `${item.match_percent}%` }} /></div><p className="text-[14px] font-medium text-[#7b16c5]">{item.match_percent}%</p></div></article>)}</div>
    </section>
  );
}

function PdfTab({ onPdf, loading }: { onPdf: () => void; loading: string }) {
  return <section className="rounded-[18px] border border-[#e7dff2] bg-white p-5"><button onClick={onPdf} className="inline-flex items-center gap-2 rounded-[8px] bg-[#4898E1] px-4 py-3 text-[13px] font-medium text-white"><Download className="h-4 w-4" />{loading === "pdf" ? "Preparing PDF..." : "Download Full Kundli PDF"}</button></section>;
}
