import Link from "next/link";
import { Binary, Stars } from "lucide-react";

const featureCards = [
  {
    title: "Kundli Generating",
    description: "Find Your Pefect Match.",
    icon: Stars,
    gradient: "bg-[linear-gradient(90deg,#2830d3_0%,#1696cf_56%,#11d8b0_100%)]",
  },
  {
    title: "Kundli Matching",
    description: "Find Your Pefect Match.",
    icon: Stars,
    gradient: "bg-[linear-gradient(90deg,#a70fdf_0%,#d00698_48%,#df0052_100%)]",
  },
  {
    title: "Numerology",
    description: "Discover Your Destiny.",
    icon: Binary,
    gradient: "bg-[linear-gradient(90deg,#b69a10_0%,#d57732_48%,#df2a6a_100%)]",
  },
];

function FeatureCards() {
  return (
    <section className="w-full bg-white px-5 pb-14 sm:px-8 sm:pb-18 lg:px-10">
      <div className="mx-auto grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((card) => {
          const Icon = card.icon;

            const href =
              card.title === "Kundli Generating" ? "/User/kundali" :
              card.title === "Kundli Matching" ? "/User/kundali" :
              card.title === "Numerology" ? "/User/Numerology" : "#";

            return (
              <Link key={card.title} href={href}>
                <article
                  className={`min-h-[126px] rounded-[22px] px-6 py-5 text-white shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${card.gradient}`}
                >
                  <Icon size={38} strokeWidth={1.8} />
                  <h3 className="mt-3 text-[1.2rem] font-medium tracking-[-0.03em]">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-white/92">
                    {card.description}
                  </p>
                </article>
              </Link>
            );
        })}
      </div>
    </section>
  );
}

export default FeatureCards;
