export default function SkillsSection() {
  const skills = ["Palmistry", "Vastu", "Tarot", "Astrology"];

  return (
    <div className="space-y-2">
      <h2 className="font-[DM_Sans] font-semibold text-[18px] capitalize">
        Skills & Expertise
      </h2>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="font-[DM_Sans] font-medium text-[11px] capitalize bg-gradient-to-r from-yellow-100 to-[#4898E1]/10 px-3 py-1 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
