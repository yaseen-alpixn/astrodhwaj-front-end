type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function FilterTabs({ value = "All", onChange }: Props) {
  const tabs = ["All", "Approved", "Pending", "Rejected"];

  return (
    <div className="flex  gap-3 rounded-t bg-gray-100 p-2 text-[13px]">
      {tabs.map((tab, i) => (
        <button
          key={i}
          onClick={() => onChange?.(tab)}
          className={`h-[35px] min-w-[90px] px-[10px] py-[5px] rounded-lg border ${
            tab === value
              ? "bg-[#4898E1] text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
