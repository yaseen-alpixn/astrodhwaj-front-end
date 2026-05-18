import { Calendar, Clock3, Heart, MapPin, Star } from "lucide-react";

import {
  compatibilityTraits,
  doshaCards,
  dashaCards,
  kundaliTabs,
  planetStrengths,
  remedyPoints,
  summaryCards,
} from "./data";
import KundaliChartArt from "./KundaliChartArt";

function toneClasses(tone: "green" | "yellow" | "red") {
  if (tone === "green") {
    return {
      card: "border-[#2fd458] bg-[#ebffef]",
      badge: "bg-[#16c33a] text-white",
      bar: "from-[#c89b15] to-[#7b16c5]",
    };
  }

  if (tone === "red") {
    return {
      card: "border-[#ff8d8d] bg-[#fff0f0]",
      badge: "bg-[#ff5b5b] text-white",
      bar: "from-[#ffd60a] to-[#7b16c5]",
    };
  }

  return {
    card: "border-[#ffd657] bg-[#fff9df]",
    badge: "bg-[#f2c300] text-white",
    bar: "from-[#f2c300] to-[#7b16c5]",
  };
}

function BirthDetailsForm() {
  return (
    <section className="rounded-[18px] border border-[#e7dff2] bg-white p-4 shadow-[0_10px_24px_rgba(32,17,56,0.04)] sm:p-5">
      <h2 className="text-[18px] font-semibold text-[#171717]">
        Enter Your Birth Details
      </h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">
            Full Name
          </span>
          <input
            className="h-11 w-full rounded-[8px] border border-[#cfc8da] px-3 text-sm outline-none"
            placeholder="Enter your full name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">
            Date of Birth
          </span>
          <div className="flex h-11 items-center rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#7c7589]">
            <input
              className="w-full outline-none"
              placeholder="DD / MM / YYYY"
            />
            <Calendar className="h-4 w-4 shrink-0" />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">
            Time of Birth
          </span>
          <div className="flex h-11 items-center rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#7c7589]">
            <input className="w-full outline-none" placeholder="-- : --" />
            <Clock3 className="h-4 w-4 shrink-0" />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[14px] font-medium text-[#222]">
            Place of Birth
          </span>
          <div className="flex h-11 items-center rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#7c7589]">
            <input
              className="w-full outline-none"
              placeholder="City, State, Country"
            />
            <MapPin className="h-4 w-4 shrink-0" />
          </div>
        </label>
      </div>
      <label className="mt-4 block max-w-full sm:max-w-[244px]">
        <span className="mb-1.5 block text-[14px] font-medium text-[#222]">
          Gender
        </span>
        <select className="h-11 w-full rounded-[8px] border border-[#cfc8da] px-3 text-sm text-[#7c7589] outline-none">
          <option>Add gender</option>
        </select>
      </label>
      <button className="mt-4 inline-flex items-center gap-2 rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
        <Star className="h-4 w-4" />
        Generate Kundli
      </button>
    </section>
  );
}

function TabBar() {
  return (
    <section className="grid grid-cols-2 gap-2 rounded-[14px] border border-[#e7dff2] bg-white p-2 shadow-[0_10px_24px_rgba(32,17,56,0.04)] sm:grid-cols-4">
      {kundaliTabs.map((tab, index) => (
        <button
          key={tab}
          type="button"
          className={
            index === 0
              ? "rounded-[6px] bg-[#7717c5] px-4 py-2 text-[13px] font-medium text-white"
              : "rounded-[6px] bg-[#f4f4f4] px-4 py-2 text-[13px] font-medium text-[#222]"
          }
        >
          {tab}
        </button>
      ))}
    </section>
  );
}

function ChartCards() {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
        <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">
          Lagna Chart (Birth Chart)
        </h3>
        <KundaliChartArt variant="lagna" />
        <div className="mt-3 rounded-[10px] bg-[#fff2f2] px-3 py-2 text-[12px] font-normal leading-relaxed text-[#6a5362]">
          <span className="text-[11px] font-medium text-[#ff3f3f]">
            Legend:
          </span>{" "}
          Ac = Ascendant, Su = Sun, Mo = Moon, Ma = Mars, Me = Mercury, Ju =
          Jupiter, Ve = Venus, Sa = Saturn, Ra = Rahu, Ke = Ketu
        </div>
      </article>
      <article className="rounded-[18px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
        <h3 className="mb-2 text-[16px] font-semibold text-[#171717]">
          Chandra Kundali (Moon Chart)
        </h3>
        <KundaliChartArt variant="chandra" />
      </article>
    </section>
  );
}

function SectionButtons() {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <button className="rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
        Get Kundali Matching
      </button>
      <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium ">
        Consult Expert
      </button>
      <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium ">
        Download
      </button>
    </div>
  );
}

function DashaSection() {
  return (
    <section className="space-y-3">
      <h2 className="font-medium">Vimshottari Dasha Periods</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {dashaCards.slice(0, 2).map((card) => (
          <article
            key={card.title}
            className="rounded-[14px] border border-[#e7dff2] bg-[linear-gradient(90deg,#fff7d8_0%,#f5e7ff_100%)] p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-[16px] font-semibold text-[#171717]">
                  {card.title}
                </h3>
                <p className="mt-1 text-[12px] font-normal text-[#61576b]">
                  {card.range}
                </p>
              </div>
              {card.badge ? (
                <span className="rounded-full bg-[#7717c5] px-3 py-1 text-[11px] font-medium text-white">
                  {card.badge}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <article className="max-w-full lg:max-w-[520px] rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]">
        <h3 className="text-[16px] font-semibold text-[#171717]">
          {dashaCards[2].title}
        </h3>
        <p className="mt-1 text-[12px] font-normal text-[#61576b]">
          {dashaCards[2].range}
        </p>
      </article>
      <div className="rounded-[8px] bg-[#fff8d8] px-3 py-3 text-[13px] font-normal leading-[22px] text-[#4a4038]">
        <b> Current Period Insights:</b> Jupiter Mahadasha with Venus Antardasha
        brings opportunities in creativity, relationships, and spiritual growth.
        Favorable time for new ventures.
      </div>
      <div className="grid max-w-full lg:max-w-[520px] gap-2 sm:grid-cols-2">
        <button className="rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
          Consult Expert
        </button>
        <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium ">
          Download
        </button>
      </div>
    </section>
  );
}

function DoshaSection() {
  return (
    <section className="space-y-4 mt-4">
      <h2 className="font-medium">Vimshottari Dasha Periods</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {doshaCards.map((item) => {
          const styles = toneClasses(item.tone);
          return (
            <article
              key={item.title}
              className={`rounded-[14px] border p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)] ${styles.card}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[16px] font-semibold text-[#171717]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] font-normal text-[#61576b]">
                    {item.text}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-medium ${styles.badge}`}
                >
                  {item.badge}
                </span>
              </div>
            </article>
          );
        })}
      </div>
      <div className="rounded-[8px] bg-[linear-gradient(90deg,#fff6db_0%,#efe1ff_100%)] px-3 py-3">
        <h3 className="text-[14px] font-medium text-[#7717c5]">
          Remedies Suggested:
        </h3>
        <ul className="mt-2 space-y-1 text-[13px] font-normal text-[#61576b]">
          {remedyPoints.map((point, idx) => (
            <li key={idx}>☆ {point}</li>
          ))}
        </ul>
      </div>
      <div className="grid max-w-full lg:max-w-[520px] gap-2 sm:grid-cols-2">
        <button className="rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
          Consult Expert
        </button>
        <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium ">
          Download
        </button>
      </div>
    </section>
  );
}

function PlanetStrengthSection() {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Planetary Positions</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {planetStrengths.map((planet) => (
          <article
            key={planet.title}
            className="rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
          >
            <h3 className="text-[16px] font-semibold text-[#171717]">
              {planet.title}
            </h3>
            <p className="mt-1 text-[12px] font-normal text-[#7a7286]">
              {planet.subtitle}
            </p>
            <div className="mt-4 flex items-end gap-3">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]">
                <div className="h-full w-[85%] rounded-full bg-[linear-gradient(90deg,#dbaf17_0%,#7b16c5_100%)]" />
              </div>
              <div className="text-right">
                <p className="text-[11px] font-medium text-[#8a8095]">
                  Strength
                </p>
                <p className="text-[14px] font-medium text-[#7b16c5]">
                  {planet.strength}%
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="grid max-w-[520px] gap-2 sm:grid-cols-2">
        <button className="rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
          Consult Expert
        </button>
        <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium  text-black">
          Download
        </button>
      </div>
    </section>
  );
}

function CompatibilitySection() {
  return (
    <section className="space-y-4">
      <h2 className="font-medium">Kundali Matching</h2>
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#d507e2_0%,#b6168e_55%,#ce213c_100%)] px-4 py-6 text-center text-white shadow-[0_18px_36px_rgba(158,17,109,0.22)]">
        <Heart className="mx-auto h-10 w-10" />
        <p className="mt-2 text-[13px] font-normal">Overall Compatibility</p>
        <p className="text-[20px] font-bold leading-none">81%</p>
        <p className="mt-1 text-[13px] font-normal">Excellent Match</p>
        <p className="mt-1 text-[12px] font-normal text-[#ffd85a]">
          Guna Score: 29/36
        </p>
      </div>
      <h2 className="font-medium mt-5">Ashtakoot Guna Milan (36 Points)</h2>
      <div className="grid gap-3 lg:grid-cols-2">
        {compatibilityTraits.map((item, index) => {
          const barClass =
            item.tone === "green" ? "bg-[#16c33a]" : "bg-[#f2c300]";
          return (
            <article
              key={`${item.title}-${index}`}
              className="rounded-[14px] border border-[#e7dff2] bg-white p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)]"
            >
              <h3 className="text-[16px] font-semibold text-[#171717]">
                {item.title}
              </h3>
              <p className="mt-1 text-[12px] font-normal text-[#7a7286]">
                Score: {item.score}
              </p>
              <div className="mt-4 flex items-end gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f1]">
                  <div
                    className={`h-full rounded-full ${barClass}`}
                    style={{ width: `${item.match}%` }}
                  />
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-medium text-[#8a8095]">
                    Match
                  </p>
                  <p className="text-[14px] font-medium text-[#7b16c5]">
                    {item.match}%
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <h2 className="font-medium mt-5">Manglik Dosha Analysis</h2>
      <div className="grid gap-3 lg:grid-cols-3">
        {summaryCards.map((item) => {
          const styles = toneClasses(item.tone);
          return (
            <article
              key={item.title}
              className={`rounded-[14px] border p-3 shadow-[0_10px_24px_rgba(32,17,56,0.04)] ${styles.card}`}
            >
              <p className="text-[14px] font-medium text-[#61576b]">
                {item.title}
              </p>
              <h3 className="mt-2 text-[16px] font-semibold text-[#171717]">
                {item.heading}
              </h3>
              <p className="mt-1 text-[12px] font-normal text-[#61576b]">
                {item.note}
              </p>
            </article>
          );
        })}
      </div>

      <div className="grid max-w-full lg:max-w-[520px] gap-2 sm:grid-cols-2">
        <button className="rounded-[8px] bg-[#7717c5] px-4 py-3 text-[13px] font-medium text-white">
          Consult Expert For More Details
        </button>
        <button className="rounded-[8px] border border-[#7717c5] px-4 py-3 text-[12px] font-medium ">
          Download
        </button>
      </div>
    </section>
  );
}

export default function KundaliSections() {
  return (
    <div className="space-y-4 bg-[#fcfbff] px-4 pb-8 pt-5 sm:px-5 lg:px-7">
      <BirthDetailsForm />
      <TabBar />
      <ChartCards />
      <SectionButtons />
      <DashaSection />
      <DoshaSection />
      <PlanetStrengthSection />
      <CompatibilitySection />
    </div>
  );
}
