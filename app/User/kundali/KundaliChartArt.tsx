type KundaliChartArtProps = {
  variant?: "lagna" | "chandra";
  houses?: Record<string, string[]>;
};

export default function KundaliChartArt({
  variant = "lagna",
  houses = {},
}: KundaliChartArtProps) {
  const centerLabel =
    variant === "lagna" ? ["Rising", "Ascendant"] : ["Moon", "Ascendant"];
  const positions: Record<string, [number, number]> = {
    "1": [160, 58],
    "2": [230, 42],
    "3": [278, 92],
    "4": [254, 160],
    "5": [278, 228],
    "6": [230, 278],
    "7": [160, 262],
    "8": [90, 278],
    "9": [42, 228],
    "10": [66, 160],
    "11": [42, 92],
    "12": [90, 42],
  };

  return (
    <div className="rounded-[12px] bg-[linear-gradient(90deg,#CCF7FF_0%,#E1E6FF_100%)] p-4 flex justify-center">
      <svg viewBox="0 0 320 320" className="h-[260px] w-[260px]" role="img" aria-label={`${variant} kundli chart`}>
        <rect x="34" y="34" width="252" height="252" fill="#fff" stroke="#c062b4" strokeWidth="2" />
        <path d="M34 34 L286 286 M286 34 L34 286 M160 34 L286 160 L160 286 L34 160 Z" fill="none" stroke="#c062b4" strokeWidth="1.5" />
        <text x="160" y="148" textAnchor="middle" className="fill-[#9b4d94] text-[12px] font-semibold">{centerLabel[0]}</text>
        <text x="160" y="164" textAnchor="middle" className="fill-[#9b4d94] text-[12px] font-semibold">{centerLabel[1]}</text>
        {Object.entries(positions).map(([house, point]) => {
          const [x, y] = point;
          const planets = houses[house] || [];
          return (
            <g key={house}>
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-[#b054a8] text-[10px] font-semibold">
                H{house}
              </text>
              <text x={x} y={y + 14} textAnchor="middle" dominantBaseline="middle" className="fill-[#7b2f75] text-[10px]">
                {planets.join(" ")}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
