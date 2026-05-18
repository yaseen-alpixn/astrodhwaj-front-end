import {
  Activity,
  BadgeCheck,
  Heart,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const highlights = [
  {
    title: "Verified Experts",
    icon: ShieldCheck,
    iconClassName: "text-[#2962ff]",
  },
  {
    title: "24/7 Available",
    icon: Activity,
    iconClassName: "text-[#00b24c]",
  },
  {
    title: "Quality Assured",
    icon: BadgeCheck,
    iconClassName: "text-[#e39b00]",
  },
  {
    title: "User Satisfaction",
    icon: Heart,
    iconClassName: "text-[#ff2c2c]",
  },
];

const stats = [
  {
    label: "Total Users",
    value: "10,000+",
    icon: Users,
    iconWrapperClassName: "bg-[#2b6cf0]",
  },
  {
    label: "Expert Astrologers",
    value: "500+",
    icon: Star,
    iconWrapperClassName: "bg-[#9333ea]",
  },
  {
    label: "Consultations",
    value: "50,000+",
    icon: Activity,
    iconWrapperClassName: "bg-[#08b34d]",
  },
  {
    label: "Success Rate",
    value: "98%",
    icon: Activity,
    iconWrapperClassName: "bg-[#e6a100]",
  },
];

function AboutSection() {
  return (
    <section className="w-full bg-[linear-gradient(90deg,#f2e6ff_0%,#f9eee8_56%,#fff8c9_100%)] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
      <div className="mx-auto grid  gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-start lg:gap-10">
        <div>
          <h2 className="text-[2.6rem] font-medium tracking-[-0.05em] text-[#111111] sm:text-[3.4rem] lg:text-[4rem]">
            About{" "}
            <span className="bg-[linear-gradient(90deg,#d29623_0%,#8f61b3_100%)] bg-clip-text text-transparent">
              AstroConnect
            </span>
          </h2>

          <div className="mt-6 max-w-[720px] space-y-7 text-[1.1rem] leading-relaxed text-[#44414b] sm:text-[1.25rem]">
            <p>
              AstroConnect is India&apos;s leading online platform connecting
              users with certified astrologers, tarot readers, numerologists,
              and spiritual healers. Our mission is to make authentic spiritual
              guidance accessible to everyone, anytime, anywhere.
            </p>
            <p>
              With over 500+ verified experts and 10,000+ satisfied users, we
              provide a secure and reliable platform for seekers of spiritual
              wisdom and professionals in the field.
            </p>
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 sm:gap-y-8">
            {highlights.map((item) => {
              const Icon = item.icon;

              return (
                <div key={item.title} className="flex items-center gap-4">
                  <div className="flex h-13 w-13 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(0,0,0,0.12)]">
                    <Icon
                      className={item.iconClassName}
                      size={23}
                      strokeWidth={2.1}
                    />
                  </div>
                  <span className="text-[1.1rem] font-medium text-[#161616] sm:text-[1.25rem]">
                    {item.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[22px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:p-7">
          <div className="space-y-6">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="flex items-center justify-between rounded-[20px] bg-[#f8f8f8] px-5 py-6"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full text-white ${stat.iconWrapperClassName}`}
                    >
                      <Icon size={23} strokeWidth={2.1} />
                    </div>
                    <span className="text-[1.05rem] font-medium text-[#6a6a6a] sm:text-[1.2rem]">
                      {stat.label}
                    </span>
                  </div>

                  <span className="text-[1.8rem] font-medium tracking-[-0.04em] text-[#111111] sm:text-[2.2rem]">
                    {stat.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
