import type { NumerologyGridCell } from "@/app/User/Numerology/numerologyData";

type NumerologyGridProps = {
  grid: NumerologyGridCell[];
};

export default function NumerologyGrid({ grid }: NumerologyGridProps) {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white px-5 py-6 shadow-[0_20px_60px_rgba(72,152,225,0.08)] sm:px-6">
      <div>
        <h3 className="text-[16px] font-bold text-[#18171d] mb-4">Lo Shu Grid</h3>
      </div>
      <div className="grid grid-cols-3 gap-3 border border-slate-200 bg-slate-50/50 p-3 rounded-2xl aspect-square w-full max-w-[280px] mx-auto">
        {grid.map((cell) => (
          <div
            key={cell.id}
            className="flex items-center justify-center border border-slate-200/80 rounded-xl bg-white aspect-square text-[22px] font-extrabold text-[#0D42AD] shadow-sm"
          >
            {cell.detail || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
