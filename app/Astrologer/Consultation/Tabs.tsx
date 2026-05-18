"use client";

interface TabsProps {
  active: string;
  setActive: (val: string) => void;
}

const tabs = ["Queue (3)", "Scheduled", "Completed", "Waiting"];

export default function Tabs({ active, setActive }: TabsProps) {
  return (
    <div className="flex gap-1 ">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`h-[38px] rounded-[5px] px-[14px] py-[10px] text-[14px] font-[DM_Sans] font-medium transition w-full sm:w-auto md:w-[248px]
          ${
            active === tab
              ? "bg-[#4898E1] text-white"
              : "bg-[#4898E1]/10 text-[#4898E1]"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
